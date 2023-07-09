const { getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const Joi = require("joi");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

const getNfts = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, limit } = req.query;

    const nfts = await getAggregate("nft", [
      {
        $match: {},
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
      { $limit: Number(limit) },
    ]);

    const nftLength = await getAggregate("nft", [
      {
        $match: {},
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

module.exports = getNfts;
