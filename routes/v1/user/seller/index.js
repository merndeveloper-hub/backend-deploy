const express = require("express");
const topSellers = require("./get-top-seller");
const router = express.Router();

router.get("/top", topSellers);

module.exports = router;
