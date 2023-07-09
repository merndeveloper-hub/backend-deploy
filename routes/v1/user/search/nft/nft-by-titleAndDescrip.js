const Joi = require("joi");
const { getAggregate } = require("../../../../../helpers");

const schema = Joi.object({
  text: Joi.string().required(),
  page: Joi.number().required(),
  limit: Joi.number().required(),
});
const nftByTitleAndDescription = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { text, page, limit } = req.query;
    const nfts = await getAggregate("nft", [
      {
        $match: {
          //   title: {
          $or: [
            {
              title: { $regex: text, $options: "i" },
            },
            {
              description: { $regex: text, $options: "i" },
            },
          ],
          //   },
          showNft: true,
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
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: Number(page),
      },
      { $limit: Number(limit) },
    ]);
    const nftsLength = await getAggregate("nft", [
      {
        $match: {
          //   title: {
          $or: [
            {
              title: { $regex: text, $options: "i" },
            },
            {
              description: { $regex: text, $options: "i" },
            },
          ],
          //   },
          showNft: true,
        },
      },
      {
        $count: "total",
      },
    ]);
    return res.status(200).send({ status: 200, nfts, nftsLength });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = nftByTitleAndDescription;
