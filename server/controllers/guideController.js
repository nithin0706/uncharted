const Guide = require("../models/Guide");

const createGuide = async (req, res) => {
    try {
        const guide = await Guide.create(req.body);

        res.status(201).json({
            message: "Guide created successfully",
            guide
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getGuides = async (req, res) => {
    try {
        const guides = await Guide.find();
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);

        if (!guide) {
            return res.status(404).json({
                message: "Guide not found"
            });
        }

        res.status(200).json(guide);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createGuide,
    getGuides,
    getGuideById
};