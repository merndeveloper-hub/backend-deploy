const Joi = require("joi");
const { deleteDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});
const deleteUser = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const user = await deleteDocument("user", {
      _id: id,
    });
    user.password = undefined;
    return res.status(200).send({
      status: 200,
      user,
      message: "User deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = deleteUser;
