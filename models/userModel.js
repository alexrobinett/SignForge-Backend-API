// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DevicePlayer',
    },
  ],
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  ],
  drafts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  refreshToken: String,
},
{
    timestamps: true
}
);

module.exports = mongoose.model('User', UserSchema);
