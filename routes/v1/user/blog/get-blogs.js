const { getAggregate } = require("../../../../helpers");

const getBlogs = async (req, res) => {
  try {
    const blogs = await getAggregate("blog", [
      {
        $match: {
          publish: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
            {
              $project: {
                followers: 0,
                following: 0,
                password: 0,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $project: {
          blogData: 0,
        },
      },
    ]);
    return res.status(200).send({ status: 200, blogs });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getBlogs;
