const express = require("express");
const { tokenVerification } = require("../../../../middleware");
const expireAuction = require("./expire-auction");
const getAuctions = require("./get-auctions");
const postAuction = require("./post-auction");
const updateAuction = require("./updateAuction");
const removeFromAuction = require("./remove-from-auction");

const router = express.Router();

router.get("/", getAuctions);
router.post("/", tokenVerification, postAuction);
router.put("/", tokenVerification, updateAuction);
router.delete("/", tokenVerification, removeFromAuction);
// Expire auction
// router.delete("/expire/:id", expireAuction);
module.exports = router;
