import mongoose from 'mongoose';

const CustomShoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  colorway: { type: String },
  materials: [{ type: String }],
  size: { type: String },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], default: 'New' },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  favorite: { type: Boolean, default: false },
  notes: { type: String },
  customizations: [{
    type: { type: String },
    description: { type: String },
    date: { type: Date }
  }]
}, { 
  timestamps: true 
});

// Add indexes for better query performance
CustomShoeSchema.index({ userId: 1, name: 1 });
CustomShoeSchema.index({ userId: 1, brand: 1 });
CustomShoeSchema.index({ userId: 1, favorite: 1 });

export default mongoose.models.CustomShoe || mongoose.model('CustomShoe', CustomShoeSchema);