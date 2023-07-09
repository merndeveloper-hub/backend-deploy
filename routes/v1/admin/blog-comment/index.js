const express = require("express");
const deleteComment = require("./delete-comment");
const deleteCommentReply = require("./delete-reply-to-comment");
const getComments = require("./get-comments");
const replytoComment = require("./reply-to-comment");
const router = express.Router();

router.get("/:blog_id", getComments);
router.delete("/:comment_id", deleteComment);
router.delete("/reply/:comment_id", deleteCommentReply);
router.put("/", replytoComment);

module.exports = router;
