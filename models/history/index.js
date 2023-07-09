const mongoose = require("mongoose");
const historySchema = require("./history-schema");

const history = mongoose.model("history", historySchema);

module.exports = history;
