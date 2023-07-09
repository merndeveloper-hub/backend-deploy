const express = require("express");
const addBlog = require("./add-blog");
const deleteBlog = require("./delete-blog");
const getBlogs = require("./get-blogs");
const getSingleBlog = require("./get-single-blog");
const updateBlog = require("./update-blog");

const router = express.Router();

router.get("/", getBlogs);
router.post("/", addBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
// Get Single Blog
router.get("/single/:id", getSingleBlog);
module.exports = router;
