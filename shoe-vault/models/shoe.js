// models/Shoe.js
const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  styleID: { type: String, required: true, unique: true },
  shoeName: { type: String, required: true },
  brand: { type: String, required: true },
  thumbnail: { type: String, required: true },
  id: { type: String, required: true, unique: true },
});

const Shoe = mongoose.model('Shoe', shoeSchema);

module.exports = Shoe;