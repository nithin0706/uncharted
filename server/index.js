const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const packageRoutes = require("./routes/packageRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const guideRoutes = require("./routes/guideRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const travelBuddyRoutes = require("./routes/travelBuddyRoutes");

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(" API is running...");
});

// TODO: mount your real routes here, e.g.:
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/buddies", travelBuddyRoutes);
app.get("/", (req, res) => { res.send("API is running..."); });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});