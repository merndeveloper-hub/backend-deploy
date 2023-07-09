const Joi = require("joi");
const { updateDocument, findOne } = require("../../../../helpers");
const bcrypt = require("bcryptjs");

const schema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  status: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$")),
});

const editRoles = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { id } = req.params;
    const { password } = req.body;
    const user = await findOne("user", { _id: id });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    }

    req.body.password
      ? (req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10)))
      : null;
    const updateRole = await updateDocument(
      "user",
      { _id: id },
      {
        ...req.body,
      }
    );
    return res
      .status(200)
      .send({ status: 200, message: "User updated Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = editRoles;
