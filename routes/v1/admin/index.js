const express = require("express");
const router = express.Router();

const user = require("./user");
const profile = require("./profile");
const nft = require("./nft");
const blog = require("./blog");
const payment = require("./payment");
const roles = require("./roles");
const search = require("./search");
const blogComment = require("./blog-comment");

router.use("/user", user);
router.use("/nft", nft);
router.use("/profile", profile);
router.use("/blog", blog);
router.use("/payment", payment);
router.use("/roles", roles);
router.use("/search", search);
router.use("/blog-comment", blogComment);

module.exports = router;
