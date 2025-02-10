import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  shoes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shoe',
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Check if the model already exists before defining it
const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

export default Collection;