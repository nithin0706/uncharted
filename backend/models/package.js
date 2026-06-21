const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    itinerary: [{
        day: Number,
        activity: String,
    }],
    inclusions: [{
        type: String,
    }],
    exclusions: [{
        type: String,
    }],
    travelDates: [{
        type: Date,
    }],
    ratings: {
        type: Number,
        default: 0,
    },
    images: [{
        type: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);