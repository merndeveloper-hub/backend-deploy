const Joi = require("joi");
const { STRIPE_SECRET_KEY } = require("../../../../config");
const { insertNewDocument } = require("../../../../helpers");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const schema = Joi.object({
  amount: Joi.string().required(),
});

const createPaymentIntent = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { amount } = req.body;
    const { stripe_customer_id, stripe_payment_method_id } = req.user;
    console.log(req.user);
    if (!stripe_customer_id || !stripe_payment_method_id) {
      return res
        .status(400)
        .send({ status: 400, message: "Update your token first" });
    }
    await stripe.paymentMethods.attach(stripe_payment_method_id, {
      customer: stripe_customer_id,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: stripe_payment_method_id,
      amount: amount || 0,
      currency: "usd",
      confirm: false,
      customer: stripe_customer_id,
    });
    console.log({ paymentIntent });
    const createPayment = await insertNewDocument("payment", {
      user_id: req.userId,
      amount,
      payment_id: paymentIntent.id,
    });
    console.log({ createPayment });
    return res.status(200).json({
      status: 200,
      message: "Your Card was captured successfully",
      data: paymentIntent,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = createPaymentIntent;
