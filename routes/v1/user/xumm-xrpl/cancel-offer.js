const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET, dev_net_xrpl } = require("../../../../config");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
const xrpl = require("xrpl");
const {
  findOne,
  updateDocument,
  insertNewDocument,
  deleteManyDocument,
} = require("../../../../helpers");

const schema = Joi.object({
  account: Joi.string().required(),
  nft_offer_index: Joi.string().required(),
});

const cancelSellNft = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { account, nft_offer_index } = req.body;
    const checkOffer = await findOne("nft", {
      nft_offer_index,
      nftType: "sell",
      owner: req.userId,
    });
    if (!checkOffer) {
      return res.status(404).send({ status: 404, message: "Offer not found" });
    }
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    const response = await client.request({
      command: "account_info",
      account: account,
      ledger_index: "validated",
    });
    // For push notification
    // const request = {
    //   txjson: {
    //     TransactionType: "NFTokenCancelOffer",
    //     Account: account,
    //     NFTokenOffers: [nft_offer_index],
    //   },
    //   user_token: req.userXummToken,
    // };
    const request = {
      TransactionType: "NFTokenCancelOffer",
      Account: account,
      NFTokenOffers: [nft_offer_index],
    };
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        // console.log("event:", event);
        req.io.to(req.params.socketId).emit("cancelSellNft", {
          data: event.data,
        });
        if (event.data.signed === true) {
          // console.log("Woohoo! The sign request was signed :)");
          // console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          req.io.to(req.params.socketId).emit("cancelSellNft", {
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
      console.log("The nft accept offer request was rejected :(");
      // req.io.to(req.params.id).emit("result", );
    }
    if (resolveData.signed === true) {
      console.log("Woohoo! The nft accept offer request was signed :)");

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
        // const client = new xrpl.Client(dev_net_xrpl);
        // await client.connect();
        const nftacceptOffer = await updateDocument(
          "nft",
          { _id: checkOffer._id },
          {
            nftType: "mint",
          }
        );
        const history = await insertNewDocument("history", {
          nft_id: checkOffer._id,
          action: "shift sell to mint",
          from: checkOffer.owner,
        });
        const deleteAllOffer = await deleteManyDocument("offer", {
          nft_id: checkOffer._id,
        });
        if (nftacceptOffer) {
          console.log("NFT shifted from sell to mint Successfully");
        }
        req.io.to(req.params.socketId).emit("cancelSellNftResult", {
          message: "NFT removed from sell successfully",
          success: true,
        });

        // await client.disconnect();
        // return res.status(200).send({ status: 200, data });
      } else {
        req.io.to(req.params.socketId).emit("cancelSellNftResult", {
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
module.exports = cancelSellNft;
