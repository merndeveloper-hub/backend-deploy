const express = require("express");
const createNotification = require("./create-notification");
const getNotification = require("./get-notification");


const router = express.Router();

router.get("/get/:id", getNotification);
router.post("/create/:socketId", createNotification);

module.exports = router;
