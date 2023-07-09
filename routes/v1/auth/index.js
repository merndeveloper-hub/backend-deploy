const express = require("express");
const router = express.Router();
const signUp = require("./signup");
const loginUser = require("./login");
const connectWallet = require("./connect-wallet");
const adminSignup = require("./admin-auth/signup");
const adminLogin = require("./admin-auth/login");
const userAuth = require("./user-auth-new");
// const checkPassword = require("./check-password");
// const { tokenVerification } = require("../../middleware");

// ROUTES * /api/auth/
//User
router.post("/login", loginUser);
router.post("/register", signUp);
// router.post("/connect-wallet", connectWallet);
// router.post("/", checkPassword);

// Admin
router.post("/admin/register", adminSignup);
router.post("/admin/login", adminLogin);

// New Auth
router.use("/user", userAuth);

module.exports = router;
