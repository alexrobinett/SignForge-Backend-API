// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    devices:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'DevicePlayer'
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Image'
    }],
    dateCreated:{
        type: Date,
        default: Date.now,
        required: true,
    },
    refreshToken: String,
});

module.exports = mongoose.model("User", UserSchema);