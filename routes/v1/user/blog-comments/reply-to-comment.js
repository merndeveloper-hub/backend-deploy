const Joi = require("joi");
const { pushIntoArray, findOne } = require("../../../../helpers");

const schema = Joi.object({
  preferred_method: Joi.string().required().valid("User", "Public"),
  user_id: Joi.string().when("preferred_method", {
    is: "User",
    then: Joi.required(),
  }),
  name: Joi.string().when("preferred_method", {
    is: "Public",
    then: Joi.required(),
  }),
  email: Joi.string().email().when("preferred_method", {
    is: "Public",
    then: Joi.required(),
  }),
  text: Joi.string().required(),
  comment_id: Joi.string().required(),
});
const replyToComment = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { preferred_method, text, comment_id, user_id } = req.body;
    const commentExist = await findOne("blogComment", { _id: comment_id });
    if (!commentExist) {
      return res.status(404).send({ status: 404, message: "No comment found" });
    }
    if (preferred_method === "User") {
      const userExist = await findOne("user", { _id: user_id });
      if (!userExist) {
        return res.status(404).send({ status: 404, message: "User Not found" });
      }
    }
    user_id && (req.body.id = user_id);
    const reply = await pushIntoArray(
      "blogComment",
      {
        _id: comment_id,
      },
      {
        reply: {
          ...req.body,
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
