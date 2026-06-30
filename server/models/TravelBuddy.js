const mongoose = require("mongoose");

const travelBuddySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    interests: [{
        type: String
    }],
    requests: [
{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}],
acceptedBuddies: [
{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
]

});

module.exports = mongoose.model(
    "TravelBuddy",
    travelBuddySchema
);