import mongoose from 'mongoose';

const customShoeSchema = new mongoose.Schema({
  styleID: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  shoeName: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
});

const CustomShoe = mongoose.models.CustomShoe || mongoose.model('CustomShoe', customShoeSchema);

export default CustomShoe;