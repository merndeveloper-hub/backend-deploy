const mongoose = require("mongoose");
const blogSchema = require("./blog-schema");

const blog = mongoose.model("blog", blogSchema);

module.exports = blog;
