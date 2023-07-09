const Joi = require("joi");
const { getAggregate } = require("../../../../../helpers");

const schema = Joi.object({
  page: Joi.number().required(),
  category: Joi.string().required(),
});

const category = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, category } = req.query;
    const nfts = await getAggregate("nft", [
      {
        $match: {
          nftType: category,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
        },
      },
      {
        $unwind: {
          path: "$created_by",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: Number(page),
      },
      { $limit: 25 },
    ]);
    const nftLength = await getAggregate("nft", [
      {
        $match: {
          nftType: category,
        },
      },
      {
        $count: "total",
      },
    ]);
    return res.status(200).send({ status: 200, nfts, nftLength });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = category;
