const Joi = require("joi");
const { getAggregate, findOne } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const schema = Joi.object({
  id: Joi.string().required(),
});
const getAllBid = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
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
    const bids = await getAggregate("bid", [
      {
        $match: {
          nft_id: ObjectID(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "bidder_id",
          foreignField: "_id",
          as: "bidder",
        },
      },
      {
        $sort: {
          bid_price: -1,
        },
      },
    ]);
    return res.status(200).json({ status: 200, bids });
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};
module.exports = getAllBid;
