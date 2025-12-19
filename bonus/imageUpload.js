const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  imagePath: String
});
const productModel = mongoose.model('products', productSchema);
app.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { title, price } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const product = new productModel({
      title,
      price,
      imagePath
    });
    await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: product,
      imagePath: imagePath
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { upload, productModel };