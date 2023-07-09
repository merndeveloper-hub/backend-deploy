const mongoose = require("mongoose");
const otpSchema = require("./otp-schema");

const otp = mongoose.model("otp", otpSchema);

module.exports = otp;
