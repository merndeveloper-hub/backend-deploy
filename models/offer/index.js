const mongoose = require("mongoose");
const offerSchema = require("./offer-schema");

const offer = mongoose.model("offer", offerSchema);

module.exports = offer;
