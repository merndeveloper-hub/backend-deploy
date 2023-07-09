const mongoose = require("mongoose");
const nftSchema = require("./nft-schema");

const nft = mongoose.model("nft", nftSchema);

module.exports = nft;
