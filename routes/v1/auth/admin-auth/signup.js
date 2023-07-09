// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const { SECRET } = require("../../../config");
const {
  findOneAndSelect,
  findOne,
  insertNewDocument,
} = require("../../../../helpers");
const Joi = require("joi");

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_no: Joi.number().required(),

  // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
  // password: Joi.string()
  //   .min(6)
  //   .max(30)
  //   .pattern(
  //     new RegExp(
  //       "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{6,30}$"
  //     )
  //   )
  //   .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$"))
    .required(),
  type: Joi.string().required(),
});

const adminSignup = async (req, res) => {
  const { email, password, type } = req.body;
  try {
    await schema.validateAsync(req.body);
    const checkType = await findOne("userType", { type });
    if (!checkType) {
      return res.status(400).send({
        status: 400,
        message: "No Type found",
      });
    }
    const checkEmail = await findOneAndSelect(
      "user",
      { email },
      "-followers -following"
    );
    if (checkEmail) {
      return res.status(400).send({
        status: 400,
        message: "User already exists with your email address",
      });
    }
    const user = await insertNewDocument("user", {
      ...req.body,
      type: checkType._id,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    user.password = undefined;
    // user.type = undefined;
    return res.status(200).send({ status: 200, user });
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = adminSignup;
