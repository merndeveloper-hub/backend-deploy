const Joi = require("joi");
const { getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const schema = Joi.object().keys({
  id: Joi.string().required(),
});

const getSingleBlog = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const blog = await getAggregate("blog", [
      {
        $match: { _id: ObjectID(id) },
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
    ]);
    return res.status(200).send({ status: 200, blog });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getSingleBlog;
