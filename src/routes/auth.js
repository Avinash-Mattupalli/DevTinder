const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res, next) => {
  try {
    //Validation of the data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    //Encrypt passowrd
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving data: " + err.message);
  }
});

module.exports = authRouter;
