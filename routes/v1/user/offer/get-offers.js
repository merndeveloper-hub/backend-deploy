const Joi = require("joi");
const { getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const schema = Joi.object({
  nft_id: Joi.string().required(),
});

const getNftOffers = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { nft_id } = req.query;
    const offers = await getAggregate("offer", [
      {
        $match: { nft_id: ObjectID(nft_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer_id",
          foreignField: "_id",
          as: "buyer_id",
        },
      },
      {
        $unwind: "$buyer_id",
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "owner_id",
        },
      },
      {
        $unwind: "$owner_id",
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    return res.status(200).send({
      status: 200,
      message: "Offers retrieved successfully",
      data: offers,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};
module.exports = getNftOffers;
