// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    owner:{
        type: ObjectId,
        required: true
    },
    messages:{
        type: Array,
        default: [],
        required: true
    },
    dateLastUpdated:{
        type: Date,
        default: Date.now,
        required: true,
    }
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("DeviceSchema", DeviceSchema);