const Joi = require("joi");
const xrpl = require("xrpl");

const schema = Joi.object({
  account: Joi.string().required(),
});

const mintNft = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { account } = req.body;
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
    await client.connect();
    const firstAccount = xrpl.Wallet.fromSeed(account);

    const tokenURL =
      "https://gateway.pinata.cloud/ipfs/QmXkXcSKFwbwwZvzEMmjip81VeZ9ZyPqnjrjiDhf6kcvMy";

    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: firstAccount.classicAddress,
      URI: xrpl.convertStringToHex(tokenURL),
      Flags: 8,
      // TokenTaxon: 0
      NFTokenTaxon: 0,
    };

    const Tx = await client.submitAndWait(transactionBlob, {
      wallet: firstAccount,
      // account: firstAccount.classicAddress
    });
    // Tx.result.TransactionType;
    // Tx.result.hash;
    // Tx.result.Fee;

    // const getNfts = await client.request({
    // 	method: "account_nfts",
    // 	account: firstAccount.classicAddress
    // });
    // const balance = await client.getXrpBalance(firstAccount.classicAddress);
    client.disconnect();
    // return res.status(200).send({ status: 200, Tx, getNfts, balance });
    return res.status(200).send({ status: 200, Tx });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = mintNft;
