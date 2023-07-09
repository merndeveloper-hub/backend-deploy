const express = require("express");
// const { upload } = require("../../lib");
// const { tokenVerification } = require("../../middleware");
const profile = require("./profile");
const xrpl = require("./xrpl");
const xummXrpl = require("./xumm-xrpl");
const blog = require("./blog");
const auction = require("./auction");
const bid = require("./bid");
const stripe = require("./stripe");
const offer = require("./offer");
const blogComment = require("./blog-comments");
const search = require("./search");
const history = require("./history");
const seller = require("./seller");
const notification = require("./notification");
const followers = require("./follower");


const { tokenVerification } = require("../../../middleware");

const router = express.Router();

router.use("/xrpl", xrpl);
router.use("/xumm-xrpl", xummXrpl);
router.use("/profile", profile);
router.use("/blog", blog);
router.use("/auction", auction);
router.use("/bid", bid);
router.use("/stripe", tokenVerification, stripe);
router.use("/offer", offer);
router.use("/blog-comment", blogComment);
router.use("/search", search);
router.use("/nft/history", history);
router.use("/seller", seller);
router.use("/notification", notification);
router.use("/follow", followers);

module.exports = router;
