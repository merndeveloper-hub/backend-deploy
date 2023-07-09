const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const auctionSchema = new mongoose.Schema(
  {
    owner_id: {
      type: SchemaType.TypeObjectId,
      ref: "users",
      required: true,
    },
    owner_xrp_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    nft_id: {
      type: SchemaType.TypeObjectId,
      ref: "nft",
      required: true,
    },
    initialBidAmount: {
      type: SchemaType.TypeString,
      required: true,
    },
    bidIncrementAmount: {
      type: SchemaType.TypeString,
      required: true,
    },
    startDate: {
      type: SchemaType.TypeDate,
      required: true,
    },
    closeDate: {
      type: SchemaType.TypeDate,
      required: true,
    },
    expire: {
      type: SchemaType.TypeBoolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = auctionSchema;
