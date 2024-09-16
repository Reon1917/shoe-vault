import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  shoes: [
    {
      styleID: String,
      shoeName: String,
      brand: String,
      thumbnail: String,
    },
  ],
}, {
  timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Check if the model already exists before defining it
const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

export default Collection;