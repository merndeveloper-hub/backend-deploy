const mongoose = require("mongoose");
const blogCommentSchema = require("./blog-comment-schema");

const blogComment = mongoose.model("blogComment", blogCommentSchema);

module.exports = blogComment;
