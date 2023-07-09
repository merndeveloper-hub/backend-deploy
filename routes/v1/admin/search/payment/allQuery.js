const Joi = require("joi");
const { getAggregate, findOne } = require("../../../../../helpers");
const { ObjectID } = require("../../../../../types");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  wallet_address: Joi.string(),
  payment_id: Joi.string(),
  amount: Joi.string(),
});

const allQuery = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const {
      page,
      limit,
      wallet_address,
      first_name,
      last_name,
      payment_id,
      amount,
    } = req.query;
    const userType = await findOne("userType", { type: "User" });
    if (!userType) {
      return res
        .status(404)
        .send({ status: 404, message: "User type changed" });
    }
    if (first_name) {
      const payments = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.first_name": {
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
      const paymentLength = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.first_name": {
              $regex: first_name,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res
        .status(200)
        .send({ status: 200, data: payments, length: paymentLength[0]?.total });
    }
    if (last_name) {
      const payments = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.last_name": {
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
      const paymentLength = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.last_name": {
              $regex: last_name,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res
        .status(200)
        .send({ status: 200, data: payments, length: paymentLength[0]?.total });
    }
    if (wallet_address) {
      const payments = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.wallet_address": {
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
      const paymentLength = await getAggregate("payment", [
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            "user.wallet_address": {
              $regex: wallet_address,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res
        .status(200)
        .send({ status: 200, data: payments, length: paymentLength[0]?.total });
    }
    if (payment_id) {
      const payments = await getAggregate("payment", [
        {
          $match: {
            payment_id: {
              $regex: payment_id,
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
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
      const paymentLength = await getAggregate("payment", [
        {
          $match: {
            payment_id: {
              $regex: payment_id,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res
        .status(200)
        .send({ status: 200, data: payments, length: paymentLength[0]?.total });
    }
    if (amount) {
      const payments = await getAggregate("payment", [
        {
          $match: {
            amount: {
              $regex: amount,
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
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
      const paymentLength = await getAggregate("payment", [
        {
          $match: {
            amount: {
              $regex: amount,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ]);
      return res
        .status(200)
        .send({ status: 200, data: payments, length: paymentLength[0]?.total });
    }
    return res
      .status(400)
      .send({ status: 400, message: "Request format is not valid" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = allQuery;
