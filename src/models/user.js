const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 255 },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Please enter a strong password:{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}",
          );
        }
      },
    },
    age: { type: Number, min: 18, max: 100 },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value.toLowerCase())) {
      //     throw new Error("Invalid Gender Value");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid image url format:" + value);
        }
      },
    },
    about: {
      type: String,
      default: "Hello Everyone",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

//Compound Index- to make query run fast
userSchema.index({ firstName: 1, lastName: 1 });

// need to use the normal functions, arrow function not allowed it will break if we use this.
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, "dev@tinder@token", {
    expiresIn: "7d",
  });
  return token;
};

//Password Validation

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword,
  );
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
