const Joi = require("joi");
const xrpl = require("xrpl");

const schema = Joi.object({
	account: Joi.string().required(),
	tokenId: Joi.string().required(),
	amount: Joi.string().required()
});

const createSellOffer = async (req, res) => {
	try {
		await schema.validateAsync(req.body);
		const { account, tokenId, amount } = req.body;
		const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
		await client.connect();

		const Account = xrpl.Wallet.fromSeed(account);

		const TransactionBlob = {
			TransactionType: "NFTokenCreateOffer",
			Account: Account.classicAddress,
			NFTokenID: tokenId,
			Amount: amount,
			Flags: 1
		};

		const tx = await client.submitAndWait(TransactionBlob, { wallet: Account });

		console.log(tx);

		// let nftSellOffers;
		// try {
		// 	nftSellOffers = await client.request({
		// 		method: "nft_sell_offers",
		// 		nft_id: tokenId
		// 	});
		// } catch (err) {
		// 	return res.status(400).send({ status: 400, message: "No sell offers", nftSellOffers });
		// }
		balance = await client.getXrpBalance(Account.address);
		await client.disconnect();
		// return res.status(200).send({ status: 200, tx, nftSellOffers, balance });
		return res.status(200).send({ status: 200, tx, balance });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};

module.exports = createSellOffer;
