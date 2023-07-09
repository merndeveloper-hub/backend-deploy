const { ObjectID } = require("../../../../types");
const {
  findOne,
  deleteDocument,
  customUpdate,
  getAggregate,
} = require("../../../../helpers");
const Joi = require("joi");
const schema = Joi.object({
  reply_id: Joi.string().required(),
});

const deleteCommentReply = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { comment_id } = req.params;
    const { reply_id } = req.query;
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
    // const deleteComment = await deleteDocument("blogComment", {
    //   _id: comment_id,
    // });
    const findreply = await getAggregate("blogComment", [
      {
        $match: {
          _id: ObjectID(comment_id),
          reply: {
            $elemMatch: {
              _id: ObjectID(reply_id),
            },
          },
        },
      },
    ]);
    if (!findreply.length) {
      return res.status(404).send({ status: 404, message: "No reply found" });
    }
    const removeReplyFromBlog = await customUpdate(
      "blogComment",
      {
        _id: comment_id,
      },
      {
        $pull: {
          reply: { _id: reply_id },
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "Reply Removed Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = deleteCommentReply;
