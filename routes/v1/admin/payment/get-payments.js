const Joi = require("joi");
const { getAggregate } = require("../../../../helpers");

const schema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});

const getPayments = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { page, limit } = req.query;
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
      // {
      //   $unwind: "$user",
      // },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: Number(page),
      },
      { $limit: Number(limit) },

      // {
      //   $project: {
      //     _id: 0,
      //     payment_id: 1,
      //     user_id: 1,
      //     verified: 1,
      //     "user._id": 1,
      //     "user.email": 1,
      //     "user.name": 1,
      //   },
      // },
    ]);
    const paymentLength = await getAggregate("payment", [
      {
        $count: "total",
      },
    ]);
    return res.status(200).send({
      status: 200,
      message: "Payments retrieved successfully",
      data: payments,
      length: paymentLength[0]?.total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = getPayments;
