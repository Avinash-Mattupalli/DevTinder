const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

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

// login

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Format");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid user credentials");
    }
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // validation of password using handler function from schema
    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      // const token = await jwt.sign({ _id: user?._id }, "dev@tinder@token", {
      //   // expiration of jwt token
      //   expiresIn: "7d",
      // });

      //using handler function defined in schema

      const token = await user.getJWT();

      res.cookie("token", token, {
        // cookie expires in 24 hrs- expiration of cookie
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //Works only in http not in https
        // httpOnly: true,
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid user credentials");
    }
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// logout

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfull");
});

module.exports = authRouter;
