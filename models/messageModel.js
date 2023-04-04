// Require Mongoose
const { Int32 } = require("mongodb");
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const storeMessageModelSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }, 
    position: {
        type: Number,
        required: true
    },
    player:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'DevicePlayer'
    },
    messageName: {
        type: String,
        required: true
    },
    draft: {
        type: Boolean,
        default: false,
        required: true,
    },
    messageType: {
        type: String,
        required: true
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
},
{
    timestamps: true
}
);

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Messages", storeMessageModelSchema);
