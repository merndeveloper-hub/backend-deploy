const Joi = require("joi");
const {
  insertNewDocument,
  deleteDocument,
  findOne,
} = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const deleteBlog = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const findBlog = await findOne("blog", { _id: id });
    if (!findBlog) {
      return res.status(404).send({ status: 404, message: "No blog found" });
    }
    const blog = await deleteDocument("blog", {
      _id: id,
    });
    return res
      .status(200)
      .send({ status: 200, message: "Blog deleted successfully", blog });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = deleteBlog;
