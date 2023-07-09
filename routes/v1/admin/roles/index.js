const express = require("express");
const deleteRoles = require("./delete");
const editRoles = require("./edit");
const getRoles = require("./get-roles");

const router = express.Router();

// router.get("/admins", getAdmins);
// router.get("/creators", getCreators);
router.get("/", getRoles);
router.put("/:id", editRoles);
router.delete("/:id", deleteRoles);

module.exports = router;
