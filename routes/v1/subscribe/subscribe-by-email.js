const Joi = require("joi");
const { findOne, insertNewDocument } = require("../../../helpers");
const { send_email } = require("../../../lib");

const schema = Joi.object({
  email: Joi.string().email().required(),
});
const subscribeByEmail = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email } = req.body;
    const findEmail = await findOne("subscribe", { email });
    if (findEmail) {
      return res
        .status(400)
        .send({ status: 400, message: "Email already subscribed" });
    }
    const subscribe = await insertNewDocument("subscribe", { email });
    send_email(
      "subscribe-email",
      { EMAIL: email },
      "Nexible",
      "Welcome!",
      email
    );

    return res
      .status(200)
      .send({ status: 200, message: "Subscribed successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = subscribeByEmail;
