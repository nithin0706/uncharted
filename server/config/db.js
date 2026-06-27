<<<<<<< HEAD
const mongoose=require("mongoose");
const connectDB=async() => {
    try{
     await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
    }catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
}
=======
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
>>>>>>> 4e779d5a5fae7cf678a485e9bdfa0e44b1799ab0
};

module.exports = connectDB;