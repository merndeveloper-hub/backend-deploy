const express = require("express");
const nft = require("./nft");

const router = express.Router();

router.use("/nft", nft);

module.exports = router;
