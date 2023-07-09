const Joi = require("joi");
const { getAggregate } = require("../../../../../helpers");

const schema = Joi.object({
  page: Joi.number().required(),
  title: Joi.string(),
  description: Joi.string(),
});

const searchByTitleAndDesc = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, title, description } = req.query;
    if (title) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
            title: { $regex: title, $options: "i" },
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
            title: { $regex: title, $options: "i" },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({
        status: 200,
        nfts,
        nftLength: nftLength,
      });
    }
    if (description) {
      const nfts = await getAggregate("nft", [
        {
          $match: {
            description: {
              $regex: description,
              $options: "i",
            },
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
            description: {
              $regex: description,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({
        status: 200,
        nfts,
        nftLength: nftLength,
      });
    }

    return res
      .status(400)
      .send({ status: 400, message: "Request format is not valid" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = searchByTitleAndDesc;
