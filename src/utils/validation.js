const validator = require("validator");
const { aggregate } = require("../models/user");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Firstname and Lastname arr required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Choose a strong passowrd");
  }
};

const validateEditProfileData = (req) => {
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditValid = Object.keys(req.body).every((field) =>
    editableFields.includes(field),
  );
  return isEditValid;
};
module.exports = { validateSignUpData, validateEditProfileData };
