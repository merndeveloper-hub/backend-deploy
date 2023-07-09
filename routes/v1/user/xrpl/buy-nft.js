const Joi = require("joi");
const xrpl = require("xrpl");

const schema = Joi.object({
	account: Joi.string().required(),
	tokenOfferId: Joi.string().required()
});

const acceptSellOffer = async (req, res) => {
	try {
		await schema.validateAsync(req.body);
		const { account, tokenOfferId } = req.body;
		const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
		await client.connect();

		const Account = xrpl.Wallet.fromSeed(account);

		const TransactionBlob = {
			TransactionType: "NFTokenAcceptOffer",
			Account: Account.classicAddress,
			NFTokenSellOffer: tokenOfferId
		};

		const tx = await client.submitAndWait(TransactionBlob, { wallet: Account });
		balance = await client.getXrpBalance(Account.address);
		await client.disconnect();
		return res.status(200).send({ status: 200, tx, balance });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = acceptSellOffer;
