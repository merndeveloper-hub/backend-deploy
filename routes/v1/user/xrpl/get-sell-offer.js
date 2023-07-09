const xrpl = require("xrpl");

const getSellOffers = async (req, res) => {
	try {
		const tokenId = req.params.tokenId;
		const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
		await client.connect();
		let nftSellOffers;
		try {
			nftSellOffers = await client.request({
				method: "nft_sell_offers",
				nft_id: tokenId
			});
		} catch (err) {
			return res.status(400).send({ status: 400, message: "No Sell Offer", nftSellOffers });
		}
		client.disconnect();
		return res.status(200).send({ status: 200, nftSellOffers });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = getSellOffers;
