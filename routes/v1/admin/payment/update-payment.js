const Joi = require("joi");
const { getAggregate, findOne, updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  // user_id: Joi.string().required(),
  // payment_id: Joi.string().required(),
  // amount: Joi.string().required(),
  verified: Joi.boolean(),
  xrp_send: Joi.boolean(),
});
const updatePayment = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { verified, xrp_send } = req.body;
    const { id } = req.params;
    const findPayment = await findOne("payment", {
      _id: id,
    });
    if (!findPayment) {
      return res.status(404).send({
        status: 404,
        message: "Payment not found",
      });
    }
    const updatePayment = await updateDocument(
      "payment",
      {
        _id: id,
      },
      {
        verified,
        xrp_send,
      }
    );
    return res.status(200).send({
      status: 200,
      message: "Payment updated successfully",
      data: updatePayment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = updatePayment;
