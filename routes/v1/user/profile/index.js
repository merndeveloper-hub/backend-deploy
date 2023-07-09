const express = require("express");
// const { upload } = require("../../../../lib");
const { tokenVerification } = require("../../../../middleware");
const getProfile = require("./get-profile");
const updateProfile = require("./update-profile");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const router = express.Router();

router.get("/:id", getProfile);
router.put(
  "/",
  tokenVerification,
  // upload.fields([
  //   { name: "profile", maxCount: 1 },
  //   { name: "profile_banner", maxCount: 1 },
  // ]),
  multipartMiddleware,
  updateProfile
);
module.exports = router;
