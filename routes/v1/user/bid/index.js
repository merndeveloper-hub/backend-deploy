const express = require("express");
const { tokenVerification } = require("../../../../middleware");
const cancelABid = require("./cancel-a-bid");
const getAllBid = require("./get-all-bid");
const placeABid = require("./place-a-bid");

const router = express.Router();

router.get("/:id", getAllBid);
router.post("/", tokenVerification, placeABid);
router.delete("/:id", tokenVerification, cancelABid);

module.exports = router;
