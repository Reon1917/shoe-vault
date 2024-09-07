// models/Shoe.js
import mongoose from 'mongoose';

const ShoeSchema = new mongoose.Schema({
  shoeName: { type: String, required: true },
  brand: { type: String, required: true },
  silhouette: { type: String },
  styleID: { type: String, required: true, unique: true },
  colorway: { type: String },
  retailPrice: { type: Number },
  thumbnail: { type: String },
  releaseDate: { type: Date },
  description: { type: String },
  lowestResellPrice: {
    stockX: { type: Number },
    goat: { type: Number },
    flightClub: { type: Number }
  },
  resellLinks: {
    stockX: { type: String },
    goat: { type: String },
    flightClub: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Shoe || mongoose.model('Shoe', ShoeSchema);