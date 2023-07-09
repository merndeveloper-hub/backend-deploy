const { find, getAggregate, findOne } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const getNftHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const findNft = await findOne("nft", { _id: id });
    if (!findNft) {
      return res.status(404).send({
        status: 404,
        message: "NFT not found",
      });
    }
    const history = await getAggregate("history", [
      {
        $match: {
          nft_id: ObjectID(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "from",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "to",
        },
      },
    ]);
    return res.status(200).send({ status: 200, history });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getNftHistory;
