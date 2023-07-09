const mongoose = require("mongoose");
const schemaType = require("../../types");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: schemaType.TypeObjectId,
      ref: "users",
    },
    bidder_id: {
      type: schemaType.TypeObjectId,
    },
    action: {
      type: schemaType.TypeString,
    },
    nft_id: {
      type: schemaType.TypeObjectId,
      ref: "nft",
    },
  },
  { timestamps: true }
);

module.exports = notificationSchema;
