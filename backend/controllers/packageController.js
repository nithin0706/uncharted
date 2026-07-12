const mongoose = require("mongoose");
const Package = require("../models/package");
const Destination = require("../models/destination");

const createPackage = async (req, res) => {
  try {
    const {
      name,
      destination,
      duration,
      price,
      itinerary,
      inclusions,
      exclusions,
      travelDates,
      images,
    } = req.body;

    const destinationExists = await Destination.findById(destination);

    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const package_ = new Package({
      name,
      destination,
      duration,
      price,
      itinerary,
      inclusions,
      exclusions,
      travelDates,
      images,
    });

    await package_.save();

    res.status(201).json({
      message: "Package created successfully",
      package: package_,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("destination", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id).populate(
      "destination",
      "name location"
    );

    if (!package_) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.status(200).json(package_);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const package_ = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("destination", "name location");

    if (!package_) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.status(200).json({
      message: "Package updated successfully",
      package: package_,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    const package_ = await Package.findByIdAndDelete(req.params.id);

    if (!package_) {
      return res.status(404).json({
        message: "Package not found",
      });
    }

    res.status(200).json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const comparePackages = async (req, res) => {
  try {
    console.log("COMPARE HIT");
    console.log("Query:", req.query);

    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "No package ids provided" });
    }

    const idArray = ids
      .split(",")
      .map((id) => id.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    console.log("Parsed idArray:", idArray);

    const packages = await Package.find({
      _id: { $in: idArray },
    }).populate("destination", "name location");

    res.status(200).json(packages);
  } catch (error) {
    console.error("COMPARE ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  comparePackages,
};