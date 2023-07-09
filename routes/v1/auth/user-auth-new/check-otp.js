const { findOneSort } = require("../../../../helpers");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const schema = Joi.object({
  email: Joi.string().email().required(),
  otp_key: Joi.string().min(6).max(6).required(),
});

const checkOtp = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email, otp_key } = req.body;
    const check_user = await findOneSort("otp", { email });
    if (!check_user) {
      return res.status(400).send({ status: 400, message: "Email not exist" });
    }
    const otpCreated = new Date(check_user.created).getTime();
    const now = new Date().getTime();
    const diff = now - otpCreated;
    if (diff > 300000 || check_user.used) {
      return res.status(403).send({ status: 403, message: "OTP expire" });
    }
    const check_otp = bcrypt.compareSync(otp_key, check_user.otp_key);
    if (!check_otp) {
      return res.status(400).send({ status: 400, message: "Wrong OTP" });
    }
    return res.status(200).send({ status: 200, message: "OTP verified" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = checkOtp;
