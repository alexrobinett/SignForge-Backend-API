// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 28,
    },
    devices:{
        type: Array,
        default: [],
        required: true
    },
    images:{
        type: Array,
        default: [],
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now,
        required: true,
    },
    refreshToken: String,
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("UserSchema", UserSchema);