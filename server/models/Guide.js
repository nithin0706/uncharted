const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Guide", guideSchema);