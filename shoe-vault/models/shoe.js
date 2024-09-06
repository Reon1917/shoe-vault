// models/Shoe.js
import mongoose from 'mongoose';

const ShoeSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  size: { type: Number, required: true },
  price: { type: Number, required: true },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Shoe || mongoose.model('Shoe', ShoeSchema);
