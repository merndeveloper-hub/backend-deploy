const searchByEmailAndWalletAddres = require("./searchByEmailAndWalletAddres");

const express = require("express");

const router = express.Router();

router.get("/", searchByEmailAndWalletAddres);

module.exports = router;
