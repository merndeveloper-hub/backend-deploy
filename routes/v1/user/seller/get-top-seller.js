const { getAggregate } = require("../../../../helpers");

const topSellers = async (req, res) => {
  try {
    const topSellers = await getAggregate("nft", [
      {
        $group: {
          _id: "$created_by",
          total: {
            $sum: { $cond: [{ $ne: ["$owner", "$created_by"] }, 1, 0] },
          },
        },
      },
      {
        $match: {
          total: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: "$creator",
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    return res.status(200).send({ status: 200, topSellers });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = topSellers;
