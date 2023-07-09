const xrpl = require("xrpl");
const { dev_net_xrpl } = require("../../../config");

const getOffers = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    let getOffers;
    try {
      getOffers = await client.request({
        method: "nft_sell_offers",
        nft_id: tokenId,
      });
    } catch (err) {
      return res
        .status(400)
        .send({ status: 400, message: "No Sell Offer", getOffers });
    }
    client.disconnect();
    return res.status(200).send({ status: 200, getOffers });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getOffers;
