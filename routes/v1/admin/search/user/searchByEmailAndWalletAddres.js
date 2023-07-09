const Joi = require("joi");
const { getAggregate, findOne } = require("../../../../../helpers");
const { ObjectID } = require("../../../../../types");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  email: Joi.string(),
  wallet_address: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
});

const searchByEmailAndWalletAddres = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, limit, email, wallet_address, first_name, last_name } =
      req.query;
    const userType = await findOne("userType", { type: "User" });
    if (!userType) {
      return res
        .status(404)
        .send({ status: 404, message: "User type changed" });
    }
    if (email) {
      const users = await getAggregate("user", [
        {
          $match: {
            type: ObjectID(userType._id),
            email: {
              $regex: email,
              $options: "i",
            },
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
            email: {
              $regex: email,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, users, usersLength });
    }
    if (wallet_address) {
      const users = await getAggregate("user", [
        {
          $match: {
            type: ObjectID(userType._id),
            wallet_address: {
              $regex: wallet_address,
              $options: "i",
            },
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
            wallet_address: {
              $regex: wallet_address,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, users, usersLength });
    }
    if (first_name) {
      const users = await getAggregate("user", [
        {
          $match: {
            type: ObjectID(userType._id),
            first_name: {
              $regex: first_name,
              $options: "i",
            },
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
            first_name: {
              $regex: first_name,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, users, usersLength });
    }
    if (last_name) {
      const users = await getAggregate("user", [
        {
          $match: {
            type: ObjectID(userType._id),
            last_name: {
              $regex: last_name,
              $options: "i",
            },
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
            last_name: {
              $regex: last_name,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res.status(200).send({ status: 200, users, usersLength });
    }
    return res
      .status(400)
      .send({ status: 400, message: "Request format is not valid" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = searchByEmailAndWalletAddres;
