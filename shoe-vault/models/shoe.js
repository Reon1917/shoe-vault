import mongoose from 'mongoose';

const ShoeSchema = new mongoose.Schema({
  styleID: { type: String, required: true },
  shoeName: { type: String, required: true },
  brand: { type: String, required: true },
  thumbnail: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  retailPrice: { type: Number },
  releaseDate: { type: Date },
  description: { type: String },
  colorway: { type: String },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], default: 'New' },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  favorite: { type: Boolean, default: false },
  notes: { type: String },
}, { 
  timestamps: true 
});

// Add indexes for better query performance
ShoeSchema.index({ userId: 1, styleID: 1 });
ShoeSchema.index({ userId: 1, brand: 1 });
ShoeSchema.index({ userId: 1, favorite: 1 });

export default mongoose.models.Shoe || mongoose.model('Shoe', ShoeSchema);
