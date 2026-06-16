const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


//const packageRoutes = require("./routes/packageRoutes");
const destinationRoutes = require("./routes/destinationRoutes");

const app = express();
console.log("Checking MONGO_URI:", process.env.MONGO_URI);
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "uncharted-db",
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// Routes
//app.use("/api/packages", packageRoutes);

app.use("/api/destinations", destinationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Uncharted Travel API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});