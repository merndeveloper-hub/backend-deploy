const Joi = require("joi");
const { find, findAndPopulate, getAggregate } = require("../../../../helpers");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

const getMintedNfts = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, limit } = req.query;
    // const nfts = await find("nft", { nftType: "mint" });
    // const nfts = await findAndPopulate(
    //   "nft",
    //   { nftType: "mint" },
    //   "created_by owner",
    //   ""
    // );
    const nfts = await getAggregate("nft", [
      {
        $match: {
          nftType: "mint",
          showNft: true,
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
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$created_by",
      },
      {
        $unwind: "$owner",
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
          nftType: "mint",
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
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getMintedNfts;
