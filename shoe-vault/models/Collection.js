const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  shoes: [
    {
      shoeName: String,
      thumbnail: String,
    },
  ],
}, {
  timestamps: true,  // Automatically manage createdAt and updatedAt fields
});

// Create a Mongoose model using the schema
const Collection = mongoose.model('Collection', collectionSchema);

// Export the model
module.exports = Collection;