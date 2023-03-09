// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const storeMessageModelSchema = new Schema({
    imageOne: {
        type: String
    },
    imageOne: {
        type: String,
        required: true
    },
    imageTwo: {
        type: String,
        required: true
    },
    imageThree:{
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    points:{
        type: String,
        required: true
    },
    promo:{
        type: String,
        required: true
    },
    promoLineOne:{
        type: String,
        required: true
    },
    promoLineTwo: {
        type: String,
        required: true
    },
    disclaimerLineOne: {
        type: String,
        required: true
    },
    disclaimerLineTwo:{
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
module.exports = mongoose.model("StoreMessageModel", storeMessageModelSchema);
