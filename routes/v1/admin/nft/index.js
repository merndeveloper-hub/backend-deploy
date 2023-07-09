const express = require("express");
const deleteNft = require("./delete");
const getNfts = require("./get");
const getSingleNft = require("./get-single-nft");
const hideNftOrShow = require("./hide-nft");
const updateNfts = require("./update");

const router = express.Router();

router.get("/get", getNfts);
router.put("/update/:id", updateNfts);
router.delete("/delete/:id", deleteNft);
router.get("/single/:id", getSingleNft);
router.put("/hide", hideNftOrShow);

module.exports = router;
