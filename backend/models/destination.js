const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
    }],
    location: {
        type: String,
        required: true,
    },
    packages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
    }],
}, { timestamps: true });

module.exports = mongoose.models.Destination || mongoose.model("Destination", destinationSchema);