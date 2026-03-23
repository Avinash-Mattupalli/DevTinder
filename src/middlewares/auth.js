const jwt = require("jsonwebtoken");
const User = require("../models/user");

const admin_auth = (req, res) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (isAdmin) {
    res.send("All Data");
  } else {
    res.status(401).send("Unauthorized access");
  }
};

const userAuth = async (req, res, next) => {
  try {
    // read the token form the req.cookies
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token");
    }
    // decode the stored info using the jwt token
    const decodedMessage = await jwt.verify(token, "dev@tinder@token");
    // get the stored info from the jwt token
    const { _id } = decodedMessage;
    // get the user by id
    const user = User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};

module.exports = { admin_auth, userAuth };
