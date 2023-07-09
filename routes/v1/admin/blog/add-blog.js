const Joi = require("joi");
const { insertNewDocument } = require("../../../../helpers");

const schema = Joi.object({
  blogTitle: Joi.string().required(),
  blogImage: Joi.string().required(),
  blogDescription: Joi.string().required(),
  blogData: Joi.string().required(),
  blogTags: Joi.array().required(),
});

const addBlog = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    // const { blogData } = req.body;
    const blog = await insertNewDocument("blog", {
      ...req.body,
      userId: req.userId,
    });
    return res
      .status(200)
      .send({ status: 200, message: "Blog uploaded successfully", blog });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = addBlog;
