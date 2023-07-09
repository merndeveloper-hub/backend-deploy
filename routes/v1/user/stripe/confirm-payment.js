const Joi = require("joi");
const { STRIPE_SECRET_KEY } = require("../../../../config");
const { updateDocument, findOne } = require("../../../../helpers");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const schema = Joi.object({
  payment_intent_id: Joi.string().required(),
});

const confirmPayment = async (req, res) => {
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
    const data = await stripe.paymentIntents.confirm(payment_intent_id);
    const verifyPayment = await updateDocument(
      "payment",
      {
        payment_id: payment_intent_id,
        user_id: req.userId,
      },
      {
        verified: true,
      }
    );
    return res.status(200).send({
      status: 200,
      message: "Payment confirmed Successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports = confirmPayment;
