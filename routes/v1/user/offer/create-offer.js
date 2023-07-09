const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET, dev_net_xrpl } = require("../../../../config");
const {
  updateDocument,
  findOne,
  insertNewDocument,
  getAggregate,
} = require("../../../../helpers");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
const xrpl = require("xrpl");
const createNotification = require("../notification/create-notification");

const schema = Joi.object({
  buyer_id: Joi.string().required(),
  buyer_xrp_address: Joi.string().required(),
  nft_id: Joi.string().required(),
  owner_id: Joi.string().required(),
  // nft_id: Joi.string().required(),
  // owner_xrp_address: Joi.string().required(),
  price: Joi.string().required(),
});

const bidOffer = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    // const { account, nftTokenId, amount, _id } = req.body;
    const {
      buyer_id,
      price,
      buyer_xrp_address,
      nft_id,
      owner_id,
      // owner_xrp_address,
    } = req.body;
    console.log("req.body", req.body);
    console.log("socketid", req.params);
    const isBuyerExist = await findOne("user", { _id: buyer_id });
    if (!isBuyerExist) {
      return re.status(404).send({ status: 404, message: "No buyer found" });
    }
    const isOwnerExist = await findOne("user", { _id: owner_id });
    if (!isOwnerExist) {
      return re.status(404).send({ status: 404, message: "No Owner found" });
    }
    const isNftExist = await findOne("nft", { _id: nft_id });
    if (!isNftExist) {
      return re.status(404).send({ status: 404, message: "No NFT found" });
    }
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    const response = await client.request({
      command: "account_info",
      account: buyer_xrp_address,
      ledger_index: "validated",
    });
    // For push notification
    // const request = {
    //   txjson: {
    //     TransactionType: "NFTokenCreateOffer",
    //     Account: buyer_xrp_address,
    //     Owner: isOwnerExist.wallet_address,
    //     NFTokenID: isNftExist.NFTokenID,
    //     Amount: price,
    //     // Flags: null,
    //     // Flags: 1,
    //   },
    //   user_token: req.userXummToken,
    // };
    const request = {
      TransactionType: "NFTokenCreateOffer",
      Account: buyer_xrp_address,
      Owner: isOwnerExist.wallet_address,
      NFTokenID: isNftExist.NFTokenID,
      Amount: price,
      // Flags: null,
      // Flags: 1,
    };
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        // console.log("event:", event);
        req.io.to(req.params.socketId).emit("bidOffer", {
          data: event.data,
        });
        if (event.data.signed === true) {
          console.log("Woohoo! The sign request was signed :)");
          console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          console.log("The sign request was rejected :(");
          req.io.to(req.params.socketId).emit("bidOffer", {
            data: "User rejected the request :(",
          });
          return false;
        }
      }
    );
    res.status(200).send({
      status: 200,
      // qr_png: `<img src=${subscription.created.refs.qr_png}/>`,
      qr_png: subscription.created.refs.qr_png,
      link: subscription.created.next.always,
    });
    console.log("New payload created, URL:", subscription.created);

    const resolveData = await subscription.resolved;

    if (resolveData.signed === false) {
      console.log("The nft create offer request was rejected :(");
      // req.io.to(req.params.id).emit("result", );
    }

    if (resolveData.signed === true) {
      console.log("Woohoo! The nft create offer request was signed :)");

      /**
       * Let's fetch the full payload end result, and get the issued
       * user token, we can use to send our next payload per Push notification
       */
      console.log(resolveData);
      const result = await Sdk.payload.get(resolveData.payload_uuidv4);
      console.log("result:", result, "========>");
      console.log(
        "User token:",
        result.application.issued_user_token,
        "==========>"
      );
      // req.io.to(req.params.socketId).emit("result", result);
      if (result.response.dispatched_result === "tesSUCCESS") {
        // result.response.account;
        console.log("result.response.account", result.response.account);
        // const client = new xrpl.Client(dev_net_xrpl);
        // const client = new xrpl.Client(dev_net_xrpl_nft_xumm);
        // await client.connect();
        const nftBuyOffers = await client.request({
          method: "nft_buy_offers",
          nft_id: isNftExist.NFTokenID,
        });
        console.log({
          nftBuyOffers,
          offers: nftBuyOffers.result.offers,
          offerLength: nftBuyOffers.result.offers.length,
        });
        const offerLength = nftBuyOffers.result.offers.length;
        data = nftBuyOffers.result.offers.filter(
          (offer) =>
            offer.owner === isBuyerExist.wallet_address &&
            offer.amount === price
        );
        console.log("data", data);
        if (!data.length) {
          console.log("didn't get the data in the data object", data);
        }
        // delete data.owner;
        const createBuyOffer = await insertNewDocument("offer", {
          ...data[0],
          the_real_owner: data[0].owner,
          buyer_id: isBuyerExist._id,
          buyer_xrp_address: isBuyerExist.wallet_address,
          nft_id: isNftExist._id,
          owner_id: isOwnerExist._id,
          owner_xrp_address: isOwnerExist.wallet_address,
        });
        console.log("createBuyOffer", createBuyOffer);
        req.io.to(req.params.socketId).emit("bidOfferResult", {
          message: "Offer created Successfully",
          success: true,
        });

        var createNotifications = await createNotification(
          owner_id,
          buyer_id,
          (action = "Create Offer"),
          nft_id,
          req.params.socketId
        );

        console.log(
          createBuyOffer.owner_id,
          createBuyOffer.buyer_id,
          (action = "placed a offer"),
          createBuyOffer.nft_id,
          "owais"
        );

        // req.io.to(req.params.socketId).emit("notification", {
        //   message: "Offer created Successfully",
        //   success: true,
        //   data:{
        //     owner_id,
        //     buyer_id,
        //     nft_id,
        //   }
        // }),() => {
        //   console.log("hello world");
        // };

        console.log("1");

        const newNft = await getAggregate("offer", [
          {
            $match: { _id: createBuyOffer._id },
          },
          {
            $lookup: {
              from: "users",
              localField: "buyer_id",
              foreignField: "_id",
              as: "buyer_id",
            },
          },
          {
            $unwind: "$buyer_id",
          },
          {
            $lookup: {
              from: "users",
              localField: "owner_id",
              foreignField: "_id",
              as: "owner_id",
            },
          },
          {
            $unwind: "$owner_id",
          },
        ]);
        req.io.emit("nftLiveOffer", { nft: newNft });
        req.io.emit("notification", { nft: "hey " });

        req.io.to(req.params.socketId).emit("notification", {
          message: "Offer created Successfully",
          data:{owner_id,buyer_id,nft_id},
          success: true,
        });

        console.log("155", newNft);
        console.log("155", isNftExist._id, createBuyOffer);
        await client.disconnect();

        // const nftOffer = await client.request({
        //   method: "nft_sell_offers",
        //   nft_id: isNftExist.NFTokenID,
        // });
        // console.log({ nftOffer });
        // data = nftOffer.result.offers[0];
        // // delete data.owner;
        // console.log(nftOffer);
        // const nftCreateOffer = await insertNewDocument("offer", {
        //   ...req.body,
        //   owner_xrp_address: isOwnerExist.wallet_address,
        // });
        // if (nftCreateOffer) {
        //   console.log("NFt offer created");
        // }
        // req.io
        //   .to(req.params.socketId)
        //   .emit("bidOfferResult", { nft: nftCreateOffer });
        // await client.disconnect();
        // return res.status(200).send({ status: 200, data: "dadad" });
      } else {
        req.io.to(req.params.socketId).emit("bidOfferResult", {
          message: `${result.response.dispatched_result} error occurred`,
          success: false,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = bidOffer;

// const Joi = require("joi");
// const { XummSdk } = require("xumm-sdk");
// const {
//   XUM_KEY,
//   XUM_SECRET,
//   dev_net_xrpl,
//   dev_net_xrpl_nft,
// } = require("../../../config");
// const {
//   updateDocument,
//   findOne,
//   insertNewDocument,
// } = require("../../../helpers");
// const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
// const xrpl = require("xrpl");
// const client = new xrpl.Client(dev_net_xrpl_nft);

// const schema = Joi.object({
//   buyer_id: Joi.string().required(),
//   buyer_xrp_address: Joi.string().required(),
//   nft_id: Joi.string().required(),
//   owner_id: Joi.string().required(),
//   nft_id: Joi.string().required(),
//   // owner_xrp_address: Joi.string().required(),
//   price: Joi.string().required(),
// });

// const bidOffer = async (req, res) => {
//   try {
//     await schema.validateAsync(req.body);
//     // const { account, nftTokenId, amount, _id } = req.body;
//     const {
//       buyer_id,
//       price,
//       buyer_xrp_address,
//       nft_id,
//       owner_id,

//       // owner_xrp_address,
//     } = req.body;
//     const operational_wallet = xrpl.Wallet.fromSeed(
//       "sEdVWMZnjcwD44gVoKJQvZnhiKWDB52"
//     );

//     let d = new Date();
//     d.setDate(d.getDate() + parseInt(7));
//     var expirationDate = xrpl.isoTimeToRippleTime(d);
//     const transactionBlob = {
//       TransactionType: "NFTokenCreateOffer",
//       Account: operational_wallet.classicAddress,
//       Owner: "rMfsCeMYmNEjk1ATZF9WL5sjU8fTvHWNhC",
//       NFTokenID:
//         "00080000DC873CB554224CEE34BB013F3600158C35C0A9440000099B00000000",
//       Amount: "12356",
//       Flags: null,
//     };
//     // if (expirationDate != null) {
//     //   transactionBlob.Expiration = expirationDate;
//     // }

//     await client.connect();
//     const tx = await client.submitAndWait(transactionBlob, {
//       wallet: operational_wallet,
//     });
//     await client.disconnect();

//     return res.status(200).json({ status: 200, tx });
//     // const isBuyerExist = await findOne("user", { _id: buyer_id });
//     // if (!isBuyerExist) {
//     //   return re.status(404).send({ status: 404, message: "No buyer found" });
//     // }
//     // const isOwnerExist = await findOne("user", { _id: owner_id });
//     // if (!isOwnerExist) {
//     //   return re.status(404).send({ status: 404, message: "No Owner found" });
//     // }
//     // const isNftExist = await findOne("nft", { _id: nft_id });
//     // if (!isNftExist) {
//     //   return re.status(404).send({ status: 404, message: "No NFT found" });
//     // }
//     // console.log({
//     //   TransactionType: "NFTokenCreateOffer",
//     //   Account: buyer_xrp_address,
//     //   // Owner: isOwnerExist.wallet_address,
//     //   NFTokenID: isNftExist.NFTokenID,
//     //   Amount: price,
//     //   // Flags: null,
//     //   Flags: 1,
//     // });
//     // let d = new Date();
//     // d.setDate(d.getDate() + parseInt(7));
//     // var expirationDate = xrpl.isoTimeToRippleTime(d);
//     // const request = {
//     //   TransactionType: "NFTokenCreateOffer",
//     //   Account: buyer_xrp_address,
//     //   Owner: isOwnerExist.wallet_address,
//     //   NFTokenID: isNftExist.NFTokenID,
//     //   Amount: price,
//     //   // Flags: null,
//     //   Expiration: expirationDate,
//     //   Flags: 1,
//     // };

//     // const subscription = await Sdk.payload.createAndSubscribe(
//     //   request,
//     //   (event) => {
//     //     console.log("New payload event:", event.data);
//     //     // console.log("event:", event);
//     //     req.io.to(req.params.socketId).emit("bidOffer", {
//     //       data: event.data,
//     //     });
//     //     if (event.data.signed === true) {
//     //       // console.log("Woohoo! The sign request was signed :)");
//     //       // console.log("data", event.data);
//     //       return event.data;
//     //     }

//     //     if (event.data.signed === false) {
//     //       // console.log("The sign request was rejected :(");
//     //       return false;
//     //     }
//     //   }
//     // );
//     // res.status(200).send({
//     //   status: 200,
//     //   // qr_png: `<img src=${subscription.created.refs.qr_png}/>`,
//     //   qr_png: subscription.created.refs.qr_png,
//     //   link: subscription.created.next.always,
//     // });
//     // console.log("New payload created, URL:", subscription.created);

//     // const resolveData = await subscription.resolved;

//     // if (resolveData.signed === false) {
//     //   console.log("The nft create offer request was rejected :(");
//     //   // req.io.to(req.params.id).emit("result", );
//     // }

//     // if (resolveData.signed === true) {
//     //   console.log("Woohoo! The nft create offer request was signed :)");

//     //   /**
//     //    * Let's fetch the full payload end result, and get the issued
//     //    * user token, we can use to send our next payload per Push notification
//     //    */
//     //   console.log(resolveData);
//     //   const result = await Sdk.payload.get(resolveData.payload_uuidv4);
//     //   console.log("result:", result, "========>");
//     //   console.log(
//     //     "User token:",
//     //     result.application.issued_user_token,
//     //     "==========>"
//     //   );
//     // req.io.to(req.params.socketId).emit("result", result);
//     // if (result.response.account) {
//     //   const client = new xrpl.Client(dev_net_xrpl);
//     //   await client.connect();

//     //   const nftOffer = await client.request({
//     //     method: "nft_sell_offers",
//     //     nft_id: isNftExist.NFTokenID,
//     //   });
//     //   data = nftOffer.result.offers[0];
//     //   // delete data.owner;
//     //   console.log(nftOffer);
//     //   const nftCreateOffer = await insertNewDocument("offer", {
//     //     ...req.body,
//     //     owner_xrp_address: isOwnerExist.wallet_address,
//     //   });
//     //   if (nftCreateOffer) {
//     //     console.log("NFt offer created");
//     //   }
//     //   req.io
//     //     .to(req.params.socketId)
//     //     .emit("bidOfferResult", { nft: nftCreateOffer });

//     //   await client.disconnect();
//     //   // return res.status(200).send({ status: 200, data });
//     // }
//     // }
//   } catch (e) {
//     console.log(e);
//     return res.status(400).send({ status: 400, message: e.message });
//   }
// };
// module.exports = bidOffer;

// const xrpl = require("xrpl");
// const { dev_net_xrpl_nft } = require("../../../config");

// // const Joi = require("joi");
// // const { XummSdk } = require("xumm-sdk");
// // const { XUM_KEY, XUM_SECRET } = require("../../../config");
// // const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);

// // const schema = Joi.object().keys({
// //   buyer_id: Joi.string().required(),
// //   buyer_xrp_address: Joi.string().required(),
// //   nft_id: Joi.string().required(),
// //   owner_id: Joi.string().required(),

// //   nft_id: Joi.string().required(),
// //   // owner_xrp_address: Joi.string().required(),
// //   price: Joi.string().required(),
// // });
// const createOffer = async (req, res) => {
//   try {
//     const client = new xrpl.Client(dev_net_xrpl_nft);
//     await client.connect();
//     //   nftCreateOffers = await client.request({
//     // command: "nft_buy_offers",
//     // nft_id:
//     //   "00090000D0B007439B080E9B05BF62403911301A7B1F0CFAA048C0A200000007",
//     // ledger_index: "validated",
//     //   });
//     const transactionBlob = {
//       TransactionType: "NFTokenCreateOffer",
//       Account: "rf35UZBhEeGb7Jgip6W1SAB3ZKmWxQbJSU",
//       Owner: "rMfsCeMYmNEjk1ATZF9WL5sjU8fTvHWNhC",
//       NFTokenID:
//         "00080000DC873CB554224CEE34BB013F3600158C35C0A9440000099B00000000",
//       Amount: "1000000",
//       Flags: null,
//     };
//     const tx = await client.submitAndWait(transactionBlob, {
//       wallet: "rf35UZBhEeGb7Jgip6W1SAB3ZKmWxQbJSU",
//     });
//     client.disconnect();
//     return res.status(400).send({ status: 200, tx });
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({ status: 500, message: e.message });
//   }
// };

// module.exports = createOffer;
