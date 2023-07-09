const Joi = require("joi");
const { findOne, insertNewDocument } = require("../../../../helpers");
const { insertMany } = require("../../../../models/user");
const socket = require('socket.io')
const io = socket();



// const schema = Joi.object({
//   userId: Joi.string().required(),
//   offer_id: Joi.string().required(),
//   action: Joi.string().required(),
//   nft_id: Joi.string().required(),
// });

const createNotification = async (userId, bidder_id, action, nft_id, socketId) => {
  try {
    console.log(userId, bidder_id, action, nft_id, "body");

    const checkUser = await findOne("notification", {
      userId: userId,
      nft_id: nft_id,
    });

    const createUser = await insertNewDocument("notification", {
      userId: userId,
      bidder_id: bidder_id,
      action: action,
      nft_id: nft_id,
    });

    // io.emit("notification", () => {
    //   console.log("placed a bid");


    // });

    
    // io.to(socketId).emit("notification", () => {
      
    //   console.log(socketId,"hwll");
    // }
    //   // message: "Offer created Successfully",
    //   // success: true,
    //   // data: createUser

      
    // );
    // // if (!checkUser) {
    // //   return res.json({ status: 401, message: "Notification not created" });
    // }
  } catch (error) {
    console.log(error, "error");
    //return res.json({ status: 500, message: error.message });
  }
};

module.exports = createNotification;
