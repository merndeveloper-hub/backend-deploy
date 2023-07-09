const express = require("express");
const acceptSellOffer = require("./buy-nft");
const createSellOffer = require("./create-sell-offer");
const getSellOffers = require("./get-sell-offer");
const getUserNft = require("./get-user-nft");
const mintNft = require("./mint-nft");
const router = express.Router();

router.post("/mint-nft", mintNft);
router.get("/get-user-nft/:account", getUserNft);
router.get("/get-sell-offers/:tokenId", getSellOffers);
router.put("/accept-sell-offer", acceptSellOffer);
router.post("/create-sell-offer", createSellOffer);

module.exports = router;
