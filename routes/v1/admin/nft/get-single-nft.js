const Joi = require("joi");
const { findOne, getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const schema = Joi.object({
  id: Joi.string().required(),
});

const getSingleNft = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const findNft = await findOne("nft", {
      _id: id,
    });
    if (!findNft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    const nft = await getAggregate("nft", [
      {
        $match: {
          _id: ObjectID(id),
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
    ]);
    if (nft.length) {
      return res.status(200).send({ status: 200, nft: nft[0] });
    }
    return res.status(200).send({ status: 200, nft: null });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getSingleNft;
