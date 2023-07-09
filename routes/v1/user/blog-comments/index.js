const express = require("express");
const addComment = require("./add-comment");
const getComments = require("./get-blog-comments");
const replyToComment = require("./reply-to-comment");

const router = express.Router();

router.post("/", addComment);
router.get("/:blog_id", getComments);
router.put("/", replyToComment);

module.exports = router;
