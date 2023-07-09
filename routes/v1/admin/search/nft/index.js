const express = require("express");
const category = require("./category");
const searchByTitleAndDesc = require("./searchByTitleAndDesc");
const router = express.Router();

router.get("/category", category);
router.get("/", searchByTitleAndDesc);

module.exports = router;
