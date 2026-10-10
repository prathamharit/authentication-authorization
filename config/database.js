const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.error("Error connecting to database:", err.message);
            process.exit(1);
        });
};