const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is not valid status type`,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequest,
);

module.exports = { ConnectionRequest };
