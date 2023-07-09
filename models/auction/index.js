const mongoose = require("mongoose");
const auctionSchema = require("./auction-schema");

const auction = mongoose.model("auction", auctionSchema);

module.exports = auction;
