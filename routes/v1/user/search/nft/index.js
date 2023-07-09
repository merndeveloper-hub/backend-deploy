const express = require("express");
const nftByTag = require("./nft-by-tag");
const nftByTitleAndDescription = require("./nft-by-titleAndDescrip");

const router = express.Router();

router.get("/tag", nftByTag);
router.get("/", nftByTitleAndDescription);

module.exports = router;
