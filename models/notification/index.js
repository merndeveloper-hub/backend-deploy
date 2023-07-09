const mongoose = require("mongoose");
const notificationSchema = require("./notification-schema");

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;
