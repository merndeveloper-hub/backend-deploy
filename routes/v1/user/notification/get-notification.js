const { find, getAggregate, findOne } = require("../../../../helpers");
const { ObjectID } = require("../../../../types");

const getNotification = async (req, res) => {
  try {
    const { id, socketId } = req.params;
    console.log(id, "id");
    const findNotification = await findOne("notification", { userId: id });
    console.log(findNotification, "findNotifications");

    if (!findNotification) {
      return res.status(404).send({
        status: 404,
        message: "No Notification not found",
      });
    }
    const notification = await getAggregate("notification", [
      {
        $match: {
          userId: ObjectID(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "bidder_id",
          foreignField: "_id",
          as: "bidder",
        },
      },
      {
        $lookup: {
          from: "nfts",
          localField: "nft_id",
          foreignField: "_id",
          as: "nft_id",
        },
      },
    ]);

    console.log(notification, "notification");



    return res.status(200).send({ status: 200, notification });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getNotification;
