const mongoose = require("mongoose");
const schemaType = require("../../types");

const historySchema = new mongoose.Schema(
  {
    from: {
      type: schemaType.TypeObjectId,
      ref: "users",
    },
    price: {
      type: schemaType.TypeString,
    },
    action: {
      type: schemaType.TypeString,
    },
    to: {
      type: schemaType.TypeObjectId,
      ref: "users",
    },
    nft_id: {
      type: schemaType.TypeObjectId,
      ref: "nft",
    },
  },
  { timestamps: true }
);

module.exports = historySchema;
