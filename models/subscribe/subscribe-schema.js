const mongoose = require("mongoose");
const schemaType = require("../../types");

const subscribeSchema = new mongoose.Schema(
  {
    email: {
      type: schemaType.TypeString,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = subscribeSchema;
