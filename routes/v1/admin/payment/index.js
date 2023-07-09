const express = require("express");
const deletePayment = require("./delete-payment");
const getPayments = require("./get-payments");
const updatePayment = require("./update-payment");

const router = express.Router();

router.get("/", getPayments);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
