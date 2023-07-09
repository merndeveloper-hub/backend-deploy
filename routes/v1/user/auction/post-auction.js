const Joi = require("joi");
const { findOne, updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  nftId: Joi.string().required(),
  initialBidAmount: Joi.string().required(),
  startDate: Joi.date().required(),
  closeDate: Joi.date().required(),
  //   bidIncrementAmount: Joi.string().required(),
});
const postAuction = async (req, res) => {
  try {
    // console.log(req.userId);
    await schema.validateAsync(req.body);
    const { nftId, initialBidAmount, startDate, closeDate } = req.body;
    const checkNftExist = await findOne("nft", { _id: nftId });
    if (!checkNftExist) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft does not exist" });
    }
    const checkOwnerAndNft = await findOne("nft", {
      _id: nftId,
      owner: req.userId,
    });
    if (!checkOwnerAndNft) {
      return res
        .status(400)
        .json({ status: 400, message: "You are not the owner of this nft" });
    }
    const data = {
      nftType: "auction",
      initialBidAmount,
      startDate,
      closeDate,
      expire: false,
    };
    const updateNft = await updateDocument("nft", { _id: nftId }, { ...data });
    return res
      .status(200)
      .json({ status: 200, updateNft, message: "Your Nft is now on auction" });
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = postAuction;
