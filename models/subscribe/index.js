const mongoose = require("mongoose");
const subscribeSchema = require("./subscribe-schema");

const subscribe = mongoose.model("subscribe", subscribeSchema);

module.exports = subscribe;
