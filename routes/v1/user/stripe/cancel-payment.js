const Joi = require("joi");
const { STRIPE_SECRET_KEY } = require("../../../../config");
const { findOne } = require("../../../../helpers");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const schema = Joi.object({
  payment_intent_id: Joi.string().required(),
});

const cancelPayment = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { payment_intent_id } = req.body;
    const findPayment = await findOne("payment", {
      payment_id: payment_intent_id,
      user_id: req.userId,
    });
    if (!findPayment) {
      return res.status(404).send({
        status: 404,
        message: "Payment not found",
      });
    }
    const data = await stripe.paymentIntents.cancel(payment_intent_id);
    return res.status(200).send({
      status: 200,
      message: "Payment has been canceled",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = cancelPayment;
