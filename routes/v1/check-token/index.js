const express = require("express");
const verifyToken = require("./verify-token");

const router = express.Router();

router.get("/verify", verifyToken);

module.exports = router;
