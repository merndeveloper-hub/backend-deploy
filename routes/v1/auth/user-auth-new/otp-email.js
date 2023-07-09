const Joi = require("joi");
const bcrypt = require("bcryptjs");
const {
  generateRandomNumber,
  insertNewDocument,
  findOne,
} = require("../../../../helpers");
const { send_email } = require("../../../../lib");

const schema = Joi.object({
  email: Joi.string().email().required(),
});

const otpToEmail = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email } = req.body;
    const check_email_exist = await findOne("user", { email });
    if (check_email_exist) {
      return res
        .status(400)
        .json({ status: 400, message: "This Email is already reserverd" });
    }
    const otp = generateRandomNumber(111111, 999999);
    const insertOtp = await insertNewDocument("otp", {
      email,
      otp_key: bcrypt.hashSync(otp, bcrypt.genSaltSync(10)),
    });
    send_email("otp-email", { OTP_KEY: otp }, "Nexible", "Your OTP", email);
    return res.status(200).json({
      status: 200,
      message: "OTP has been sent to your email",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = otpToEmail;
