const { STRIPE_SECRET_KEY, SECRET } = require("../../../../config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { findOne, updateDocument } = require("../../../../helpers");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const schema = Joi.object({
  stripe_card_number: Joi.string().required(),
  stripe_card_exp_month: Joi.string().required(),
  stripe_card_exp_year: Joi.string().required(),
  stripe_card_cvc: Joi.string().required(),
});

const addStripeCard = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const {
      stripe_card_number,
      stripe_card_exp_month,
      stripe_card_exp_year,
      stripe_card_cvc,
    } = req.body;
    const { email } = req.user;
    const check_email_exist = await findOne("user", { email });
    if (!check_email_exist) {
      return res.status(404).send({ status: 200, message: "User not found" });
    }
    const userType = await findOne("userType", { type: "User" });
    if (!userType) {
      return res
        .status(404)
        .send({ status: 404, message: "User type not found" });
    }
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: stripe_card_number,
        exp_month: stripe_card_exp_month,
        exp_year: stripe_card_exp_year,
        cvc: stripe_card_cvc,
      },
    });
    console.log(paymentMethod);
    let data = {
      stripe_payment_method_id: paymentMethod.id,
      stripe_card_number,
      stripe_card_exp_month,
      stripe_card_exp_year,
      stripe_card_cvc,
      type: userType._id,
    };
    const update_user = await updateDocument("user", { email }, data);
    var token = jwt.sign({ id: update_user._id }, SECRET,{
      expiresIn: "24h",
    });
    return res.status(200).send({
      status: 200,
      update_user,
      token,
      message: "Stripe Account added Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = addStripeCard;
