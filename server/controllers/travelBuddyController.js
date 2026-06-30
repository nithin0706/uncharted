const TravelBuddy = require("../models/TravelBuddy");

exports.createBuddyRequest = async (req, res) => {
    try {

        const {
            destination,
            startDate,
            endDate,
            budget,
            interests
        } = req.body;

        const buddyRequest =
            await TravelBuddy.create({
                user: req.user.id,
                destination,
                startDate,
                endDate,
                budget,
                interests
            });

        res.status(201).json({
            message: "Travel buddy request created",
            buddyRequest
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.getAllBuddyRequests = async (req, res) => {
    try {

        const requests = await TravelBuddy.find()
            .populate("user", "name email");

        res.status(200).json(requests);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.getMatches = async (req, res) => {
    try {
        
        const myRequest = await TravelBuddy.findOne({
            user: req.user.id
        });

        if (!myRequest) {
            return res.status(404).json({
                message: "No travel request found"
            });
        }

        const matches = await TravelBuddy.find({
            destination: myRequest.destination,
            user: { $ne: req.user.id }
        }).populate("user", "name email");
       
        res.status(200).json(matches);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.getMyRequest = async (req, res) => {
    try {

        const myRequest = await TravelBuddy.findOne({
            user: req.user.id
        }).populate("user", "name email");

        if (!myRequest) {
            return res.status(404).json({
                message: "No travel request found"
            });
        }

        res.status(200).json(myRequest);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.sendBuddyRequest = async (req, res) => {
    try {

        const travelPlan = await TravelBuddy.findById(req.params.id);

        if (!travelPlan) {
            return res.status(404).json({
                message: "Travel plan not found"
            });
        }

        if (travelPlan.user.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        if (travelPlan.requests.includes(req.user.id)) {
            return res.status(400).json({
                message: "Request already sent"
            });
        }

        travelPlan.requests.push(req.user.id);

        await travelPlan.save();

        res.status(200).json({
            message: "Buddy request sent successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.getIncomingRequests = async (req, res) => {
    try {

        const myPlan = await TravelBuddy.findOne({
            user: req.user.id
        }).populate("requests", "name email");

        if (!myPlan) {
            return res.status(404).json({
                message: "Travel plan not found"
            });
        }

        res.status(200).json(myPlan.requests);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};
exports.acceptBuddyRequest = async (req, res) => {
    try {

        const myPlan = await TravelBuddy.findOne({
            user: req.user.id
        });

        if (!myPlan) {
            return res.status(404).json({
                message: "Travel plan not found"
            });
        }

        const requesterId = req.params.userId;

        if (!myPlan.requests.includes(requesterId)) {
            return res.status(400).json({
                message: "Request not found"
            });
        }

        myPlan.requests = myPlan.requests.filter(
            id => id.toString() !== requesterId
        );

        myPlan.acceptedBuddies.push(requesterId);

        await myPlan.save();

        res.status(200).json({
            message: "Buddy request accepted"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};