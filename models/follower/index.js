const mongoose = require("mongoose");
const followSchema = require("./followers-schema");

const follower = mongoose.model("follower", followSchema);

module.exports = follower;
