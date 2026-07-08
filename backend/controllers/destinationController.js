const Destination = require("../models/destination");

const createDestination = async (req, res) => {
    try {
        const { name, description, images, location } = req.body;

        const existing = await Destination.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Destination already exists" });
        }

        const destination = new Destination({ name, description, images, location });
        await destination.save();

        res.status(201).json({ message: "Destination created successfully", destination });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json({ message: "Destination updated successfully", destination });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createDestination, getDestinations, getDestinationById, updateDestination, deleteDestination };