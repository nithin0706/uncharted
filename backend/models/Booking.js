const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package"
    },

    travelDate: {
        type: Date,
        required: true
    },

    numberOfPeople: {
        type: Number,
        required: true
    },

    bookingStatus: {
        type: String,
        default: "Booked"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);