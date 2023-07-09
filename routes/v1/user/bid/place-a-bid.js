const Joi = require("joi");
const {
  getAggregate,
  findOne,
  insertNewDocument,
} = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
  bidder_id: Joi.string().required(),
  bidder_xrp_address: Joi.string().required(),
  bid_price: Joi.string().required(),
});

const placeABid = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { id, bidder_id, bidder_xrp_address, bid_price } = req.body;

    const checkNftOnAuction = await findOne("nft", {
      _id: id,
      nftType: "auction",
      expire: false,
    });
    if (!checkNftOnAuction) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft is not on auction" });
    }
    const checkBidder = await findOne("user", {
      _id: bidder_id,
    });
    if (!checkBidder) {
      return res.status(400).json({ status: 400, message: "No User found" });
    }
    const data = {
      bidder_id,
      bidder_xrp_address,
      bid_price,
      nft_id: id,
    };
    const bid = await insertNewDocument("bid", { ...data });
    return res.status(200).json({ status: 200, bid });
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};
module.exports = placeABid;
