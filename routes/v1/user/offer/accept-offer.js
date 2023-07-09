const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET, dev_net_xrpl } = require("../../../../config");
const {
  updateDocument,
  findOne,
  insertNewDocument,
  deleteDocument,
  deleteManyDocument,
} = require("../../../../helpers");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
const xrpl = require("xrpl");

const schema = Joi.object({
  nft_offer_index: Joi.string().required(),
  wallet_address: Joi.string().required(),
});
const accecptOffer = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { nft_offer_index, wallet_address } = req.body;
    const checkOffer = await findOne("offer", { nft_offer_index });
    if (!checkOffer) {
      return res.status(400).send({ status: 400, message: "Offer not found" });
    }
    const check_wallet_address = await findOne("user", { wallet_address });
    if (!check_wallet_address) {
      return res
        .status(400)
        .send({ status: 400, message: "Wallet Address not found" });
    }
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    const response = await client.request({
      command: "account_info",
      account: wallet_address,
      ledger_index: "validated",
    });
    await client.disconnect();
    // For push notification
    // const request = {
    //   txjson: {
    //     TransactionType: "NFTokenAcceptOffer",
    //     Account: wallet_address,
    //     NFTokenBuyOffer: nft_offer_index,
    //   },
    //   user_token: req.userXummToken,
    // };
    const request = {
      TransactionType: "NFTokenAcceptOffer",
      Account: wallet_address,
      NFTokenBuyOffer: nft_offer_index,
    };
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        // console.log("event:", event);
        req.io.to(req.params.socketId).emit("acceptBuyOffer", {
          data: event.data,
        });
        if (event.data.signed === true) {
          // console.log("Woohoo! The sign request was signed :)");
          // console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          req.io.to(req.params.socketId).emit("acceptBuyOffer", {
            data: "User rejected the request :(",
          });

          // console.log("The sign request was rejected :(");
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

      console.log(resolveData);
      const result = await Sdk.payload.get(resolveData.payload_uuidv4);
      console.log("result:", result, "========>");
      console.log(
        "User token:",
        result.application.issued_user_token,
        "==========>"
      );
      if (result.response.dispatched_result === "tesSUCCESS") {
        console.log("result.response.account", result.response.account);
        const getOfferFromDb = await findOne("offer", { nft_offer_index });
        if (!getOfferFromDb) {
          req.io.to(req.params.socketId).emit("acceptBuyOfferResult", {
            message: "Error: offer Not found in the DB",
            success: false,
          });
        }
        const deleteAllOffer = await deleteManyDocument("offer", {
          nft_id: getOfferFromDb.nft_id,
        });
        if (!deleteAllOffer) {
          req.io.to(req.params.socketId).emit("acceptBuyOfferResult", {
            message: "Error Occured while deleting offers",
            success: false,
          });
        }
        const updateOwner = await updateDocument(
          "nft",
          { _id: getOfferFromDb.nft_id },
          { owner: getOfferFromDb.buyer_id, nftType: "mint" }
        );
        const history = await insertNewDocument("history", {
          nft_id: getOfferFromDb.nft_id,
          action: "offer accepted",
          from: getOfferFromDb.owner_id,
          price: getOfferFromDb.amount,
          to: getOfferFromDb.buyer_id,
        });
        if (!updateOwner) {
          req.io.to(req.params.socketId).emit("acceptBuyOfferResult", {
            message: "Error occured while updating nt owner",
            success: false,
          });
        }
        // const createBuyOffer = insertNewDocument("offer", {
        //   ...data,
        //   the_real_owner: data.owner,
        //   buyer_id: isBuyerExist._id,
        //   buyer_xrp_address: isBuyerExist.wallet_address,
        //   nft_id: isNftExist._id,
        //   owner_id: isOwnerExist._id,
        //   owner_xrp_address: isOwnerExist.wallet_address,
        // });
        req.io.to(req.params.socketId).emit("acceptBuyOfferResult", {
          message: "Nft Buyed Successfully",
          success: true,
        });
        req.io.emit("acceptBuyOfferResultLive", { nft: [] });

        req.io.to(req.params.socketId).emit("notification",{
          message:"Accept Sreated Successfully",
          success: true
        })


      } else {
        req.io.to(req.params.socketId).emit("acceptBuyOfferResult", {
          message: `${result.response.dispatched_result} error occurred`,
          success: false,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};
module.exports = accecptOffer;
