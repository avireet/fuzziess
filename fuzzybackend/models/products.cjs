// models/Product.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedback: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating:{type:Number,required:true},
  images: [{ type: String }],
  feedbacks: [feedbackSchema], // Embed feedback here
});

module.exports = mongoose.model('Product', productSchema);
