const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    // if (!token) {
    //   throw new Error("Invalid token");
    // }
    // const decodedMessage = await jwt.verify(token, "dev@tinder@token");
    // const { _id } = decodedMessage;
    // const user = await User.findById(_id);
    const user = req.user;
    if (!user) {
      throw new Error("Invalid request: Login again");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
