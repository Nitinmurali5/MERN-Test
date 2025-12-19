require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

let categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

let categoryModel = mongoose.model('categories', categorySchema);

let userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String
});

let userModel = mongoose.model('users', userSchema);

let productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String
});

let productModel = mongoose.model('products', productSchema);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/categories', async (req, res) => {
  try {
    let category = new categoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    let categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    let category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/categories/:id', async (req, res) => {
  try {
    let category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/categories/:id', async (req, res) => {
  try {
    let category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/reset-password', async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    let user = await userModel.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    let hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/products', async (req, res) => {
  try {
    let product = new productModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    
    let products = await productModel.find().skip(skip).limit(limit);
    let totalProducts = await productModel.countDocuments();
    let totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/search', async (req, res) => {
  try {
    let { query, minPrice, maxPrice } = req.query;
    let filter = {};
    
    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    let products = await productModel.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const validateSignup = (req, res, next) => {
  let { username, email, password } = req.body;
  
  if (!username || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
    return res.status(400).json({ error: 'Username must be at least 3 characters and alphanumeric' });
  }
  
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!password || password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with one number' });
  }
  
  next();
};

app.post('/signup', validateSignup, async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/deleteproduct/:id', authenticateToken, async (req, res) => {
  try {
    let product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const errorHandler = (err, req, res, next) => {
  console.log(`[${new Date().toISOString()}] Error:`, err.message);
  
  let statusCode = err.statusCode || 500;
  let message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  });
};

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});