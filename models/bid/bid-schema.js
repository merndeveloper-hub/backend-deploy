const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const bidSchema = new mongoose.Schema(
  {
    bidder_id: {
      type: SchemaType.TypeObjectId,
      ref: "users",
      required: true,
    },
    bidder_xrp_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    bid_price: {
      type: SchemaType.TypeString,
      required: true,
    },
    nft_id: {
      type: SchemaType.TypeObjectId,
      ref: "nft",
      required: true,
    },
    winner: {
      type: SchemaType.TypeBoolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = bidSchema;
