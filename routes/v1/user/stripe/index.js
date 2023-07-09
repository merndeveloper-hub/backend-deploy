const express = require("express");
const cancelPayment = require("./cancel-payment");
const confirmPayment = require("./confirm-payment");
const createPaymentIntent = require("./create-payment-intent");

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);
router.post("/cancel-payment", cancelPayment);

module.exports = router;
