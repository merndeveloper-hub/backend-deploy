const { XummSdk } = require("xumm-sdk");
const { XUM_KEY, XUM_SECRET, SECRET } = require("../../../config");
const {
  findOne,
  insertNewDocument,
  updateDocument,
} = require("../../../helpers");
const jwt = require("jsonwebtoken");

// const { TxData } = require("xrpl-txdata");

const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);

const connectWallet = async (req, res) => {
  try {
    // const Verify = new TxData();
    console.log("connect Xum wallet func call");
    const appInfo = await Sdk.ping();
    console.log(appInfo);
    const request = {
      txjson: {
        TransactionType: "SignIn",
      },
    };
    const subscription = await Sdk.payload.createAndSubscribe(
      request,
      (event) => {
        console.log("New payload event:", event.data);
        req.io.to(req.params.socketId).emit("liveXum", {
          data: event.data,
          type: "success",
        });
        if (event.data.signed === true) {
          // console.log("Woohoo! The sign request was signed :)");
          // console.log("data", event.data);
          return event.data;
        }

        if (event.data.signed === false) {
          req.io.to(req.params.socketId).emit("liveXum", {
            data: "User rejected the request :(",
          });
          // console.log("The sign request was rejected :(");
          return false;
        }
      }
    );
    res.status(200).send({
      status: 200,
      message: subscription.created.refs.qr_png,
      link: subscription.created.next.always,
    });
    console.log("New payload created, URL:", subscription.created);

    const resolveData = await subscription.resolved;

    if (resolveData.signed === false) {
      console.log("The sign request was rejected :(");
      // req.io.to(req.params.id).emit("result", );
    }

    if (resolveData.signed === true) {
      console.log("Woohoo! The sign request was signed :)");

      /**
       * Let's fetch the full payload end result, and get the issued
       * user token, we can use to send our next payload per Push notification
       */
      const result = await Sdk.payload.get(resolveData.payload_uuidv4);
      console.log("result:", result, "========>");
      console.log(
        "User token:",
        result.application.issued_user_token,
        "==========>"
      );
      if (result) {
        if (req.query.userId) {
          const findUser = await findOne("user", { _id: req.query.userId });
          if (!findUser) {
            req.io.to(req.params.socketId).emit("result", {
              message: "No User Found with your user id",
              type: "error",
            });
          }
          if (findUser.wallet_address) {
            if (findUser.wallet_address === result.response.account) {
              const token = jwt.sign({ id: findUser._id }, SECRET);
              const update = await updateDocument(
                "user",
                {
                  _id: findUser._id,
                },
                {
                  xumm_token: result.application.issued_user_token,
                  xumm_scan: true,
                }
              );
              req.io.to(req.params.socketId).emit("result", {
                result,
                user: update,
                token,
                type: "success",
              });
            } else {
              req.io.to(req.params.socketId).emit("result", {
                message:
                  "wallet address does not match with the user wallet address",
                type: "error",
              });
            }
          } else {
            const checkWalletAddressExist = await findOne("user", {
              wallet_address: result.response.account,
            });
            if (checkWalletAddressExist) {
              req.io.to(req.params.socketId).emit("result", {
                type: "error",
                message: "This wallet is already in use",
              });
            } else {
              const user = await updateDocument(
                "user",
                { _id: req.query.userId },
                {
                  wallet_address: result.response.account,
                  connect_wallet: true,
                  xumm_token: result.application.issued_user_token,
                  xumm_scan: true,
                }
              );
              // console.log({ user });

              const token = jwt.sign({ id: user._id }, SECRET);
              req.io
                .to(req.params.socketId)
                .emit("result", { result, user, token, type: "success" });
            }
          }
        } else {
          let user = await findOne("user", {
            wallet_address: result.response.account,
          });
          if (user) {
            const updateXummToken = await updateDocument(
              "user",
              {
                wallet_address: result.response.account,
              },
              {
                xumm_token: result.application.issued_user_token,
                xumm_scan: true,
              }
            );
            // console.log({ updateXummToken });
            const token = jwt.sign({ id: user._id }, SECRET);
            //   return res.status(200).send({ status: 200, user, token });
            req.io
              .to(req.params.socketId)
              .emit("result", {
                result,
                user: updateXummToken,
                token,
                type: "success",
              });
          } else {
            const check_user_type = await findOne("userType", { type: "User" });
            if (!check_user_type) {
              return res
                .status(404)
                .send({ status: 404, message: "No user type found" });
            }
            user = await insertNewDocument("user", {
              wallet_address: result.response.account,
              full_Name: "Unnamed",
              bio: "I Love XRPL",
              connect_wallet: true,
              type: check_user_type._id,
              xumm_token: result.application.issued_user_token,
            });
            // console.log({ user });
            const token = jwt.sign({ id: user._id }, SECRET);
            // return res.status(200).send({ status: 200,  });
            req.io
              .to(req.params.socketId)
              .emit("result", { result, user, token, type: "success" });
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = connectWallet;

// function plusMinus(arr) {
//   // Write your code here
//   const ans = []
//   let zeros = 0;
//   let negatives = 0;
//   let positives = 0;
//   for (var i = 0; i < arr.length; i++) {
//       if (Math.sign(arr[i]) === 1) {
//           positives += 1;
//       }
//       if (Math.sign(arr[i]) === -1) {
//           negatives += 1;
//       }
//       if (Math.sign(arr[i]) === 0) {
//           zeros += 1;
//       }
//   }
//   console.log((positives / arr.length).toFixed(6));
//   console.log((negatives / arr.length).toFixed(6));
//   console.log((zeros / arr.length).toFixed(6));
//   return ans
// }

// function staircase(n) {
//   // Write your code here
//   for (var i = 1; i <= n; i++) {
//       console.log(" ".repeat(n - i) + "#".repeat(i))
//   }
// }

// function miniMaxSum(arr) {
//   // Write your code here
//   let sum = 0
//   for (var i = 0; i <= arr.length; i++) {
//       sum += arr[i]
//   }
//   let min = Math.min(...arr)
//   let max = Math.max(...arr)
//   console.log(sum - max, sum - min)
// }

// function birthdayCakeCandles(candles) {
//   // Write your code here
//   const maxNum = Math.max(...candles)
//   let countCandles = 0
//   for (var i = 0; i < candles.length; i++) {
//       if (maxNum === candles[i]) {
//           countCandles += 1
//       }
//   }
//   return countCandles
// }
// function birthdayCakeCandles(candles) {
//   // Write your code here
//   const maxNum = Math.max(...candles)
//   return candles.filter((item) => item === maxNum).length

// }

// const EventEmitter = require("events");
// const StockList = require("./stock-list.json");
// class Processor extends EventEmitter {
//   constructor() {
//     super();
//     this.stock = StockList;
//   }
//   placeOrder(payload) {
//     this.emit("PROCESSING_STARTED", payload.orderNumber);
//     const items = payload.lineItems;
//     if (item && item.length > 0) {
//       for (const item of items) {
//         const { itemId, quantity } = item;
//         const isItemNotAvailable = this.validateItemInStock(itemId, quantity);
//         if (isItemNotAvailable) {
//           this.emit("PROCESSING_FAILED", {
//             orderNumber: payload.orderNumber,
//             reason: "INSUFFICIENT_STOCK",
//             itemId: itemId,
//           });
//         }
//       }
//     } else {
//       this.emit("PROCESSING_FAILED", {
//         orderNumber: payload.orderNumber,
//         reason: "LINEITEMS_EMPTY",
//       });
//     }
//   }
//   validateItemInStock(itemId, quantity) {
//     const stock = this.stock.find(
//       (i) => i.id === itemId && i.stock >= quantity
//     );
//     if (!stock) {
//       return { itemId, quantity };
//     }
//     return null;
//   }
// }

// module.exports = Processor;
