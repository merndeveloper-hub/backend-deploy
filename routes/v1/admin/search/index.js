const express = require("express");
const nft = require("./nft");
const user = require("./user");
const payment = require("./payment");
const router = express.Router();

router.use("/nft", nft);
router.use("/user", user);
router.use("/payment", payment);

module.exports = router;
