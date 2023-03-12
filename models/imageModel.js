// Require Mongoose
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Define a schema
const { Schema } = mongoose;

const imageSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  referenceName: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Image', imageSchema);
