const express = require("express");
const createOffer = require("./create-offer");
const getNftOffers = require("./get-offers");
const accecptOffer = require("./accept-offer");
const cancelOffer = require("./cancel-offer");
const { tokenVerification } = require("../../../../middleware");

const router = express.Router();

router.get("/", getNftOffers);
router.post("/:socketId", tokenVerification, createOffer);
router.put("/:socketId", tokenVerification, accecptOffer);
//router.put("/:socketId", accecptOffer);

router.delete("/:socketId", tokenVerification, cancelOffer);
module.exports = router;
