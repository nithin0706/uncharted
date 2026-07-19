const Booking = require("../models/Booking");
const Package = require("../models/Package"); // Matches case-sensitive paths exactly

const createBooking = async (req, res) => {
    try {
        const { packageId, travelDate, numberOfPeople } = req.body;

        // Extracts ID correctly regardless of passport/JWT middleware naming conventions
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: User information missing from request session"
            });
        }

        const packageExists = await Package.findById(packageId);

        if (!packageExists) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        const booking = new Booking({
            userId,
            packageId,
            travelDate,
            numberOfPeople
        });

        await booking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("packageId");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBookingHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.params.userId
        }).populate("packageId");

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { bookingStatus: "Cancelled" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getBookingById,
    getBookingHistory,
    cancelBooking
};