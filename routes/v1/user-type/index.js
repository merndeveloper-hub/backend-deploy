const express = require("express");
const router = express.Router();
const addUserType = require("./add-user-type");
const deleteUserType = require("./delete-user-type");
const getUserTypes = require("./get-user-types");
const updateUserType = require("./update-user-type");

// ROUTES * /api/user/
router.get("/", getUserTypes);
router.post("/", addUserType);
router.delete("/", deleteUserType);
router.put("/:id", updateUserType);

module.exports = router;
