const express = require("express");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const addCreditCard = require("./add-credit-card");
const addStripeCard = require("./add-stripe-card");
const checkOtp = require("./check-otp");
const otpToEmail = require("./otp-email");
const { tokenVerification } = require("../../../../middleware");
// const { upload } = require("../../../../lib");
const addUserInfo = require("./add-user-info");

const router = express.Router();

// router.post("/add-card", addCreditCard);
router.post("/otp-email", otpToEmail);
router.post("/check-otp", checkOtp);
router.post(
  "/add-user-info",
  // upload.fields([
  //   { name: "profile", maxCount: 1 },
  //   { name: "profile_banner", maxCount: 1 },
  // ]),
  multipartMiddleware,
  addUserInfo
);
router.post("/add-stripe-card", tokenVerification, addStripeCard);

module.exports = router;
