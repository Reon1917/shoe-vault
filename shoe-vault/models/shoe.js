import mongoose from 'mongoose';

const ShoeSchema = new mongoose.Schema({
  styleID: { type: String, required: true },
  shoeName: { type: String, required: true },
  brand: { type: String, required: true },
  thumbnail: { type: String, required: true },
});

export default mongoose.models.Shoe || mongoose.model('Shoe', ShoeSchema);
