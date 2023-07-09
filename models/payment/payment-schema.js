const mongoose = require("mongoose");
const schemaType = require("../../types");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: schemaType.TypeObjectId,
      ref: "user",
      required: true,
    },
    payment_id: {
      type: schemaType.TypeString,
      required: true,
    },
    amount: {
      type: schemaType.TypeString,
      required: true,
    },
    verified: {
      type: schemaType.TypeString,
      default: false,
    },
    xrp_send: {
      type: schemaType.TypeString,
      default: false,
    },
    created_date: {
      type: schemaType.TypeDate,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = paymentSchema;
