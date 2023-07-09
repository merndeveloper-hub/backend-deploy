const { getAggregate, findOne } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");
const Joi = require("joi");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

const getUsers = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, limit } = req.query;
    const userType = await findOne("userType", { type: "User" });
    const users = await getAggregate("user", [
      {
        $match: {
          type: ObjectID(userType._id),
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: Number(page),
      },
      { $limit: Number(limit) },
    ]);
    const usersLength = await getAggregate("user", [
      {
        $match: {
          type: ObjectID(userType._id),
        },
      },
      {
        $count: "total",
      },
    ]);

    return res.status(200).send({ status: 200, users, usersLength });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getUsers;
