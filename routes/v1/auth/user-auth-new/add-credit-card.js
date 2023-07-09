const xrpl = require("xrpl");
const Joi = require("joi");
const { findOne, insertNewDocument } = require("../../../../helpers");

const schema = Joi.object({
  email: Joi.string().email().required(),
  card_holder_name: Joi.string().required(),
  credit_card: Joi.string().required(),
});

const addCreditCard = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const userType = await findOne("userType", { type: "User" });
    if (!userType) {
      return res
        .status(404)
        .send({ status: 404, message: "User type not found" });
    }
    const wallet = xrpl.Wallet.generate();
    const data = {
      ...req.body,
      account_public_key: wallet.publicKey,
      account_private_key: wallet.privateKey,
      wallet_address: wallet.classicAddress,
      account_seeds: wallet.seed,
      type: userType._id,
    };
    const newUser = await insertNewDocument("user", data);
    return res.status(200).send({ status: 200, message: newUser });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = addCreditCard;
