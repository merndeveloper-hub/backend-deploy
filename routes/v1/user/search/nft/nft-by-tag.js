const Joi = require("joi");
const { getAggregate } = require("../../../../../helpers");

const schema = Joi.object({
  tag: Joi.string(),
  nftType: Joi.string().valid("mint", "sell", "auction"),
  page: Joi.number().required(),
  limit: Joi.number().required(),
});
const nftByTag = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { tag, nftType, limit, page } = req.query;

    if (!tag?.length && !nftType?.length) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
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
            showNft: true,
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, nfts, nftsLength });
    }
    if (tag?.length && !nftType?.length) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
            tags: { $in: [new RegExp("^" + tag + "$", "i")] },
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
            tags: { $in: [new RegExp("^" + tag + "$", "i")] },
            showNft: true,
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, nfts, nftsLength });
    }
    if (!tag?.length && nftType?.length) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
            nftType,
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
            nftType,
            showNft: true,
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, nfts, nftsLength });
    }
    if (tag?.length && nftType?.length) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
            tags: { $in: [new RegExp("^" + tag + "$", "i")] },
            nftType,
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
            tags: { $in: [new RegExp("^" + tag + "$", "i")] },
            nftType,
            showNft: true,
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, nfts, nftsLength });
    }
    return res.status(403).send({
      status: 403,
      message: "Wrong Credentials provided &#128526;",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = nftByTag;
