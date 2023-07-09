const express = require("express");
const getBlogs = require("./get-blogs");
const getSingleBlog = require("./get-single-blog");

const router = express.Router();

router.get("/", getBlogs);
// Get Single Blog
router.get("/single/:id", getSingleBlog);
module.exports = router;
