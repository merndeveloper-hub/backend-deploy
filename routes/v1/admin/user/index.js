const express = require("express");
const deleteUser = require("./delete");
const getUsers = require("./get");
const updateUser = require("./update");

const router = express.Router();

router.get("/get", getUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
