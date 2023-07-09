const express = require("express");
const { tokenVerification, adminVerification } = require("../../middleware");
const auth = require("./auth");
const userType = require("./user-type");
const user = require("./user");
const xumm = require("./xumm");
const admin = require("./admin");
const token = require("./check-token");
const subscribe = require("./subscribe");
const router = express.Router();

// AUTH Routes * /api/auth/*
router.use("/auth", auth);
router.use("/user-type", userType);
router.use("/user", user);
router.use("/xumm", xumm);
router.use("/admin", adminVerification, admin);
router.use("/token", token);
router.use("/subscribe", subscribe);

module.exports = router;
