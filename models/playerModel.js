// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const { Schema } = mongoose;

const DeviceSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  playerName: {
    type: String,
    required: true,
  },
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Messages',
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
},
{
    timestamps: true
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Player', DeviceSchema);
