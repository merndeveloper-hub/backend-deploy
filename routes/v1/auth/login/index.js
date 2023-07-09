const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SECRET } = require("../../../../config");
const { getPopulatedData, findOne } = require("../../../../helpers");
const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().email().required(),
  //   password: Joi.string()
  //     .pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$"))
  //     .required(),
  //   password: Joi.string()
  // .min(6)
  // .max(30)
  // .pattern(
  //   new RegExp("^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$")
  //   new RegExp((/?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/)
  //   new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^da-zA-Z]).{8,}$")
  // )
  // .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$"))
    .required(),
});

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validate = await schema.validateAsync(req.body);
    // const populatedUser = await getPopulatedData(
    //   "user",
    //   { email },
    //   "type",
    //   "type status"
    // );
    // const user = populatedUser[0];
    const user = await findOne("user", { email });
    if (user) {
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res
          .status(404)
          .send({ status: 400, message: "Invalid Email or Password!" });
      }
      if (user.status === "Disable") {
        return res
          .status(400)
          .send({ status: 400, message: "Your account is disabled" });
      }
      user.password = undefined;
      var token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: "24h",
      });
      res.status(200).send({ status: 200, user, token });
    } else {
      return res
        .status(404)
        .send({ status: 404, message: "User does not exist!" });
    }
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = loginUser;
