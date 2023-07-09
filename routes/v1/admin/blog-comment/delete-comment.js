const { findOne, deleteDocument, customUpdate } = require("../../../../helpers");

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    let commentExist;
    try {
      commentExist = await findOne("blogComment", { _id: comment_id });
    } catch (e) {
      return res
        .status(400)
        .send({ status: 400, message: "Provide a correct comment id" });
    }
    if (!commentExist) {
      return res.status(404).send({ status: 404, message: "No comment found" });
    }
    const deleteComment = await deleteDocument("blogComment", {
      _id: comment_id,
    });
    const removeFromBlog = await customUpdate(
      "blog",
      {
        _id: commentExist.blog_id,
        comments: {
          $in: [comment_id],
        },
      },
      {
        $pull: {
          comments: comment_id,
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "Comment Deleted Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = deleteComment;
