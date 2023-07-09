const Joi = require("joi");
const { XummSdk } = require("xumm-sdk");
const {
  XUM_KEY,
  XUM_SECRET,
  PINATA_API_KEY,
  PINATA_API_SECRET,
  PINATA_API_URL,
  PINATA_JWT,
} = require("../../../../config");
const {
  convertStringToHex,
  insertNewDocument,
} = require("../../../../helpers");
const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);

const xrpl = require("xrpl");
const { dev_net_xrpl } = require("../../../../config");
// const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
var FormData = require("form-data");
const { json } = require("body-parser");
const schema = Joi.object({
  account: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  royality: Joi.string().max(50).required(),
  tags: Joi.array().required(),
});

const mintNft = async (req, res) => {
 console.log(req.body,"owais");
  
  try {
   await schema.validateAsync(req.body);
    const { account, title, description, royality,tags } = req.body;

    console.log(req.body,"hello");
   // console.log({ account, title, description, royality });
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();

    console.log(client,"client");
    const response = await client.request({
      command: "account_info",
      account:  "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
      ledger_index: "validated",
    });
   console.log(response,"response");

    const appInfo = await Sdk.ping();
    console.log(appInfo.application);
    console.log(appInfo,"appInfo");
    if (!req?.files?.nft_img?.path) {
      return res
        .status(401)
        .send({ status: 401, message: "No Image Provided" });
    }
    const nft_img = await cloudinary.uploader.upload(req?.files?.nft_img?.path);
    req.body.nft_img = nft_img.url;
    console.log("nft image :", nft_img, req.body.nft_img);
    // For push notification
   
    const request = {
      TransactionType: "NFTokenMint",
      // Account: "rJmsAaptA7KB8CXNUcY7wCHWiTytKDLgpf",
      Account: account,
      // Issuer: "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
      TransferFee: Number(royality),
      // TransferFee: 314,
      NFTokenTaxon: 0,
      Flags: 8,
      Fee: "10",
      // URI: convertStringToHex(
      URI: convertStringToHex(req.body.nft_img),
      Memos: [
        {
          Memo: {
            MemoData: convertStringToHex("You are Minting an NFT"),
            // MemoData: convertStringToHex("You are Minting an NFT"),
          },
        },
      ],
    };
    console.log(request, { tokensa: req.userXummToken });
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        // console.log("event:", event);
        req.io.to(req.params.socketId).emit("mintingNft", {
          data: event.data,
        });
        if (event.data.signed === true) {
          // console.log("Woohoo! The sign request was signed :)");
          // console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          // console.log("The sign request was rejected :(");
          // fs.unlinkSync(req.file.path);
          req.io.to(req.params.socketId).emit("mintingNft", {
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
      console.log("The nft request was rejected :(");
      // req.io.to(req.params.id).emit("result", );
    }

    if (resolveData.signed === true) {
      console.log("Woohoo! The nft request was signed :)");

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
      if (result.response.dispatched_result === "tesSUCCESS") {
        console.log("121", result.response.account);
        console.log("122", req.user.wallet_address);
        if (result.response.account !== req.user.wallet_address) {
          // const cancelPayload = await Sdk.payload.cancel(
          //   resolveData.payload_uuidv4
          // );
          const cancelPayload = await Sdk.payload.cancel(result.meta.uuid);
          console.log("cancelPayload:", cancelPayload);
          if (cancelPayload) {
            console.log("Payload cancelled");
            req.io.to(req.params.socketId).emit("mintingNft", {
              data: "Wallet Address Mismatch",
            });
            return;
          }
        }
        const getNfts = await client.request({
          method: "account_nfts",
          account: account,
        });
        // console.log(getNfts);
        let getIssuerData = getNfts.result.account_nfts.filter(
          (element) => element.Issuer === result.response.account
        );

        let maxSerialNumber = Math.max.apply(
          Math,
          getIssuerData.map(function (o) {
            return o.nft_serial;
          })
        );
        let data = getNfts.result.account_nfts.find(
          (element) => element.nft_serial === maxSerialNumber
        );
        console.log("data", data);
      
        const insertNftToDb = await insertNewDocument("nft", {
          ...data,
          ...req.body,
          // pinataImgUrl,
          // pinataMetaDataUrl,
          created_by: req.userId,
          owner: req.userId,
        });
        const mintHistory = await insertNewDocument("history", {
          nft_id: insertNftToDb._id,
          action: "mint",
          from: req.userId,
        });
        // fs.unlinkSync(req.file.path);
        if (insertNftToDb) {
          console.log("NFt created successfully");
        }
        req.io.to(req.params.socketId).emit("mintResult", {
          message: "NFT minted Successfully",
          success: true,
        });
        await client.disconnect();
      
      } else {
        req.io.to(req.params.socketId).emit("mintResult", {
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
module.exports = mintNft;
