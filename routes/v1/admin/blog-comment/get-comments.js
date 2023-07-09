const { findOne, getAggregate } = require("../../../../helpers");

const getComments = async (req, res) => {
  try {
    const { blog_id } = req.params;
    let blogExist;
    try {
      blogExist = await findOne("blog", { _id: blog_id });
    } catch (e) {
      return res
        .status(400)
        .send({ status: 400, message: "Provide a correct blog id" });
    }
    if (!blogExist) {
      return res.status(404).send({ status: 404, message: "No Blog found" });
    }
    const comments = await getAggregate("blogComment", [
      {
        $match: { blog_id: blogExist._id },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$user_id" },
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
          as: "user_id",
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     let: { replyer_id: "$reply.id" },
      //     pipeline: [
      //       { $match: { $expr: { $eq: ["$_id", "$$replyer_id"] } } },
      //       {
      //         $project: {
      //           followers: 0,
      //           following: 0,
      //           password: 0,
      //         },
      //       },
      //     ],
      //     as: "reply.user",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "reply.id",
      //     foreignField: "_id",
      //     as: "reply.user",
      //   },
      // },
      //   {
      //     $unwind: {
      //       path: "$reply.user",
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      //   {
      //     $set: {
      //       reply: "$reply",
      //     },
      //   },
      //   {
      //     $unwind: "$reply",
      //   },
      {
        $lookup: {
          from: "users",
          localField: "reply.id",
          foreignField: "_id",
          as: "usera",
        },
      },
      {
        $set: {
          "reply.user": "$usera",
        },
      },
      {
        $project: {
          usera: 0,
        },
      },
      //   {
      //     $group: {
      //       _id: "$_id",
      //       reply: { $push: "$reply" },
      //     },
      //   },
    ]);
    return res.status(200).send({ status: 200, comments });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getComments;

// Populate
