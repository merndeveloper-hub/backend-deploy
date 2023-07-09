const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET } = require("../../../config");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);

const schema = Joi.object({
  account: Joi.string().required(),
  fee: Joi.string().required(),
  nftTokenId: Joi.string().required(),
});

const burnNft = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { account, nftTokenId, fee } = req.body;
    const request = {
      TransactionType: "NFTokenBurn",
      Account: account,
      Fee: fee,
      NFTokenID: nftTokenId,
    };
    const payload = await Sdk.payload.create(request, true);
    console.log(payload);
    console.log(payload?.refs?.qr_png);
    return res
      .status(200)
      .send({
        status: 200,
        qr_png: payload.refs.qr_png,
        link: payload.next.always,
      });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = burnNft;
