<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes.js");

=======
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require("dotenv");
>>>>>>> 4e779d5a5fae7cf678a485e9bdfa0e44b1799ab0
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const packageRoutes = require("./routes/packageRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const guideRoutes = require("./routes/guideRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

connectDB();

const app = express();

app.use(express.json());
<<<<<<< HEAD
app.use(cors({
  origin: "http://localhost:5173"
}));

// routes
app.use("/api/auth", authRoutes);

=======

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Home Route
>>>>>>> 4e779d5a5fae7cf678a485e9bdfa0e44b1799ab0
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});