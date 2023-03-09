// Require Mongoose
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    owner:{
        type: ObjectId,
        required: true
    },
    fileName:{
        type: String,
        required: true
    },
    referenceName:{
        type: String,
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now,
        required: true,
    }
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("DeviceSchema", DeviceSchema);