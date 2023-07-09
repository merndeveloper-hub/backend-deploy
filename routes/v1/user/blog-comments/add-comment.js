const {
  findOne,
  insertNewDocument,
  pushIntoArray,
} = require("../../../../helpers");
const Joi = require("joi");

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
  blog_id: Joi.string().required(),
});
const addComment = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { preferred_method, user_id, name, email, text, blog_id } = req.body;
    const blogExist = await findOne("blog", { _id: blog_id });
    if (!blogExist) {
      return res.status(404).send({ status: 404, message: "No Blog found" });
    }
    if (preferred_method === "Public") {
      const comment = await insertNewDocument("blogComment", {
        preferred_method,
        name,
        email,
        text,
        blog_id,
      });

      const pushIdToBlog = await pushIntoArray(
        "blog",
        { _id: blog_id },
        { comments: comment._id }
      );
      return res.status(200).send({ status: 200, comment });
    }
    if (preferred_method === "User") {
      const userExist = await findOne("user", { _id: user_id });
      if (!userExist) {
        return res
          .status(404)
          .send({ status: 404, message: "No User found with your given id" });
      }
      const comment = await insertNewDocument("blogComment", {
        preferred_method,
        user_id,
        text,
        blog_id,
      });
      const pushIdToBlog = await pushIntoArray(
        "blog",
        { _id: blog_id },
        { comments: comment._id }
      );
      return res.status(200).send({ status: 200, comment });
    }
    return res
      .status(400)
      .send({ status: 400, message: "Invalid Credentials" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = addComment;
