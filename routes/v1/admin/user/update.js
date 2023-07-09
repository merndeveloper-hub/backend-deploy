const Joi = require("joi");
const { updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const updateUser = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const user = await updateDocument(
      "user",
      {
        _id: id,
      },
      {
        ...req.body,
      }
    );
    if (user.password) {
      user.password = undefined;
    }
    return res.status(200).send({
      status: 200,
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateUser;
