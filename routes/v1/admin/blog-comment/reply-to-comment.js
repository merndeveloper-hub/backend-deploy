const Joi = require("joi");
const { pushIntoArray, findOne } = require("../../../../helpers");

const schema = Joi.object({
  text: Joi.string().required(),
  comment_id: Joi.string().required(),
});
const replyToComment = async (req,res) => {
  try {
    await schema.validateAsync(req.query);
    const { text, comment_id } = req.query;
    const commentExist = await findOne("blogComment", { _id: comment_id });
    if (!commentExist) {
      return res.status(404).send({ status: 404, message: "No comment found" });
    }
    const reply = await pushIntoArray(
      "blogComment",
      {
        _id: comment_id,
      },
      {
        reply: {
          text,
          id: req.userId,
        },
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "Reply added successfully", reply });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: error.message });
  }
};
module.exports = replyToComment;
