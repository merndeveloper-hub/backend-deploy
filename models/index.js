const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.userType = require("./user-type");
db.nft = require("./nft");
db.blog = require("./blog");
db.offer = require("./offer");
db.auction = require("./auction");
db.bid = require("./bid");
db.otp = require("./otp");
db.payment = require("./payment");
db.blogComment = require("./blog-comment");
db.subscribe = require("./subscribe");
db.history = require("./history");
db.notification = require("./notification");
db.follower = require("./follower");

module.exports = db;
