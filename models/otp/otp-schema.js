const mongoose = require("mongoose");
const schemaType = require("../../types");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: schemaType.TypeString,
      // required: true,
    },
    telephone: {
      type: schemaType.TypeNumber,
      // required: true,
    },
    otp_key: {
      type: schemaType.TypeString,
      required: true,
    },
    used: { type: schemaType.TypeBoolean, default: false },
    created: { type: schemaType.TypeDate, default: Date.now },
  },
  { timestamps: true }
);

module.exports = otpSchema;
