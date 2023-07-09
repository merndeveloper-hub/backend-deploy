const { getAggregate } = require("../../../../helpers");

const getAuctions = async (req, res) => {
  try {
    const auctions = await getAggregate("nft", [
      {
        $match: {
          nftType: "auction",
          expire: false,
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
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
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
    ]);
    console.log(auctions);
    return res.status(200).json({ status: 200, auctions });
  } catch (error) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = getAuctions;
