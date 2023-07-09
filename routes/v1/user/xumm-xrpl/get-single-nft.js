const { findOne, getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const getSingleNft = async (req, res) => {
  try {
    const _id = req.params.id;
    // const nft = await findOne("nft", { _id  });
    const nft = await getAggregate("nft", [
      {
        $match: {
          _id: ObjectID(_id),
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
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleNft;
