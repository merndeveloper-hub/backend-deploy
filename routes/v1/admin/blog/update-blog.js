const Joi = require("joi");
const { updateDocument, findOne } = require("../../../../helpers");

const schema = Joi.object({
  blogTitle: Joi.string(),
  blogImage: Joi.string(),
  blogDescription: Joi.string(),
  blogData: Joi.string(),
  blogTags: Joi.array(),
  publish: Joi.boolean(),
});
const schemaForId = Joi.object({
  id: Joi.string().required(),
});

const updateBlog = async (req, res) => {
  try {
    await schemaForId.validateAsync(req.params);
    await schema.validateAsync(req.body);
    const { id } = req.params;
    const findBlog = await findOne("blog", { _id: id });
    if (!findBlog) {
      return res.status(404).send({ status: 404, message: "No blog found" });
    }
    const blog = await updateDocument(
      "blog",
      {
        _id: id,
      },
      {
        ...req.body,
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "Blog updated successfully", blog });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateBlog;
