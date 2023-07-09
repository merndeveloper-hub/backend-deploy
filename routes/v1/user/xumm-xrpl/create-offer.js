const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET, dev_net_xrpl } = require("../../../../config");
const {
  updateDocument,
  insertNewDocument,
  findOne,
} = require("../../../../helpers");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
const xrpl = require("xrpl");

const schema = Joi.object({
  account: Joi.string().required(),
  amount: Joi.string().required(),
  nftTokenId: Joi.string().required(),
  _id: Joi.string().required(),
});

const createOffer = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { account, nftTokenId, amount, _id } = req.body;
    const checkNft = await findOne("nft", { _id });
    if (!checkNft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    const checkNftToken = await findOne("nft", { NFTokenID: nftTokenId });
    if (!checkNftToken) {
      return res
        .status(404)
        .send({ status: 404, message: "NFT Token not found" });
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
    // txjson: {
    //   TransactionType: "NFTokenCreateOffer",
    //   Account: account,
    //   NFTokenID: nftTokenId,
    //   Amount: amount,
    //   Flags: 1,
    // }
    //   user_token: req.userXummToken,
    // };
    const request = {
      TransactionType: "NFTokenCreateOffer",
      Account: account,
      NFTokenID: nftTokenId,
      Amount: amount,
      Flags: 1,
    };
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        // console.log("event:", event);
        req.io.to(req.params.socketId).emit("createOffer", {
          data: event.data,
        });
        if (event.data.signed === true) {
          // console.log("Woohoo! The sign request was signed :)");
          // console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          req.io.to(req.params.socketId).emit("createOffer", {
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
        const nftOffer = await client.request({
          method: "nft_sell_offers",
          nft_id: nftTokenId,
        });
        data = nftOffer.result.offers.filter(
          (offer) => offer.owner === account && offer.amount === amount
        );
        delete data[0].owner;
        console.log({ nftOffer });
        console.log({ data });
        const nftCreateOffer = await updateDocument(
          "nft",
          { _id },
          {
            ...data[0],
            amount: amount,
            nftType: "sell",
          }
        );
        const history = await insertNewDocument("history", {
          nft_id: _id,
          action: "sell",
          from: nftCreateOffer.owner,
          price: amount,
        });
        if (nftCreateOffer) {
          console.log("NFt offer created");
        }
        req.io.to(req.params.socketId).emit("createOfferResult", {
          message: "NFT moved to sell Successfully",
          success: true,
        });

        await client.disconnect();
        // return res.status(200).send({ status: 200, data });
      } else {
        req.io.to(req.params.socketId).emit("createOfferResult", {
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
module.exports = createOffer;
