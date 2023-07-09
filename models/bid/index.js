const mongoose = require("mongoose");
const bidSchema = require("./bid-schema");

const bid = mongoose.model("bid", bidSchema);

module.exports = bid;
