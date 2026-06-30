const express = require("express");
const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createBuddyRequest,
    getAllBuddyRequests,
    getMatches,
    getMyRequest,
    sendBuddyRequest,
    getIncomingRequests,
    acceptBuddyRequest
} = require("../controllers/travelBuddyController");

router.post(
    "/request",
    authMiddleware,
    createBuddyRequest
);
router.get(
    "/",
    authMiddleware,
    getAllBuddyRequests
);
router.get(
    "/matches",
    authMiddleware,
    getMatches
);
router.get(
    "/my-request",
    authMiddleware,
    getMyRequest
);
router.post(
    "/request/:id",
    authMiddleware,
    sendBuddyRequest
);
router.get(
    "/incoming-requests",
    authMiddleware,
    getIncomingRequests
);
router.post(
    "/accept/:userId",
    authMiddleware,
    acceptBuddyRequest
);
module.exports = router;