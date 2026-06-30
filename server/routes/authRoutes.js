const express = require("express"); 
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {login,register,getProfile} = require("../controllers/authController");

router.post("/login",login);
router.post("/register",register);
router.get("/profile",authMiddleware,getProfile);
module.exports =router;