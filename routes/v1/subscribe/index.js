const express = require("express");
const getSubscribers = require("./get-subscriber");
const subscribeByEmail = require("./subscribe-by-email");

const router = express.Router();

router.post("/", subscribeByEmail);
router.get("/", getSubscribers);
module.exports = router;
