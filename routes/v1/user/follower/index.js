const express = require("express")
const router = express.Router();
const follow = require("./follower");
const checked = require("./get")
const checkFollow = require("./getFollowers")

router.post("/userfollow", follow);
router.get("/get-followers", checkFollow);
router.get("/get", checked);


module.exports = router;