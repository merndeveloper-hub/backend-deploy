const mongoose = require("mongoose");
const paymentSchema = require("./payment-schema");

const payment = mongoose.model("payment", paymentSchema);

module.exports = payment;
