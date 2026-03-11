const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://avinash_mattupalli:avinash%4003@cluster0.rkhenph.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
