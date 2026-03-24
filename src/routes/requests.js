const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send("Connection request successfull");
});

module.exports = requestRouter;
