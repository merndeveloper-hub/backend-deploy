const Joi = require("joi");
const xrpl = require("xrpl");
const { dev_net_xrpl } = require("../../../config");

const schema = Joi.object({
  account: Joi.string().required(),
});

const getUserNft = async (req, res) => {
  try {
    schema.validateAsync(req.params);
    const account = req.params.account;
    // const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    const getNfts = await client.request({
      method: "account_nfts",
      account: account,
    });
    balance = await client.getXrpBalance(account);
    client.disconnect();
    return res.status(200).send({ status: 200, getNfts, balance });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getUserNft;
