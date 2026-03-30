const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const requestRouter = express.Router();
const { ConnectionRequest } = require("../models/ConnectionRequest");

requestRouter.post(
  //status can be ignore or interested
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatuses = ["ignore", "interested"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid Status Type :" + status);
      }

      // check if user to which connection rewuest is ent is present or not

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send({ message: "User not found" });
      }

      // if there is existing connection request not allow

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          // { fromUserId: toUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).send({ message: "Connection request already exists!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " Connection request successfull " +
          "is " +
          status +
          " in " +
          toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async () => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: "Connection request " + status, data });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});
module.exports = requestRouter;
