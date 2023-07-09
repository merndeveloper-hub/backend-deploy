const express = require("express");
const allQuery = require("./allQuery");

const router = express.Router();

router.get("/", allQuery);

module.exports = router;
