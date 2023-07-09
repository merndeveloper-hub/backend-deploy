const { getAggregate } = require("../../../../helpers");

const Joi = require("joi");
const schema = Joi.object({
  page: Joi.number().required(),
  publish: Joi.boolean().required(),
});

const getBlogs = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, publish } = req.query;
    console.log(publish, typeof publish);
    const blogs = await getAggregate("blog", [
      {
        $match: {
          publish: JSON.parse(publish),
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
        $project: {
          blogData: 0,
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: Number(page),
      },
      { $limit: 5 },
    ]);

    const blogLength = await getAggregate("blog", [
      {
        $match: {
          publish: JSON.parse(publish),
        },
      },
      {
        $count: "total",
      },
    ]);
    return res.status(200).send({ status: 200, blogs, blogLength });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getBlogs;
