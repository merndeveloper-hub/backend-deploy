const shedule = require("node-schedule");

const ExpireAuctions = async () => {
  try {
    // shedule.scheduleJob("*/3 * * * * *", async () => {
    console.log("ExpireAuctions Pass");
    shedule.scheduleJob("*/5 * * * *", async () => {
      console.log("Expire Auctions");
    });
  } catch (e) {
    console.log("Error Occured in ExpireAuctions", e);
  }
};

module.exports = { ExpireAuctions };
// const now = new Date();
// const expired = await Auction.find({
//   endDate: { $lt: now },
// })
//   .populate("seller", "email")
//   .lean();
// if (expired.length) {
//   const transformed = expired.map((auction) => ({
//     ...auction,
//     ended: true,
//   }));
//   const promises = transformed.map((auction) =>
//     Auction.findByIdAndUpdate(auction._id, auction)
//   );
//   await Promise.all(promises);
//   console.log("Auctions expired");
// }
