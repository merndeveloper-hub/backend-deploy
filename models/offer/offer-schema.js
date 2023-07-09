const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const offerSchema = new mongoose.Schema(
  {
    buyer_id: {
      type: SchemaType.TypeObjectId,
      ref: "users",
      required: true,
    },
    buyer_xrp_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    amount: {
      type: SchemaType.TypeString,
      required: true,
    },
    nft_offer_index: {
      type: SchemaType.TypeString,
      required: true,
    },
    nft_id: {
      type: SchemaType.TypeObjectId,
      ref: "nft",
      required: true,
    },
    owner_id: {
      type: SchemaType.TypeObjectId,
      ref: "users",
      required: true,
    },
    the_real_owner: {
      type: SchemaType.TypeString,
      required: true,
    },
    owner_xrp_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    accepted: {
      type: SchemaType.TypeBoolean,
      default: false,
    },
    offer_type: {
      type: SchemaType.TypeString,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = offerSchema;
