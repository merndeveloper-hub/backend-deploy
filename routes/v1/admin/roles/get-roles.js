const Joi = require("joi");
const { findOne, find, getAggregate } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const schema = Joi.object({
  type: Joi.string().required(),
});

const getRoles = async (req, res) => {
  // id: req.userId,
  // user: req.user,
  try {
    await schema.validateAsync(req.query);
    const { type } = req.query;
    const findType = await findOne("userType", { type });
    if (!findType) {
      return res.status(404).send({
        status: 404,
        message: "User type not found",
      });
    }
    // const findRoles = await find("user", { type: findType._id });
    const findRoles = await getAggregate("user", [
      {
        $match: {
          type: ObjectID(findType._id),
        },
      },
      {
        $lookup: {
          from: "user-types",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      {
        $unwind: "$type",
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    return res.status(200).send({ status: 200, data: findRoles });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = getRoles;
