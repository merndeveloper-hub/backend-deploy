const Joi = require("joi");
const { findOne, updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  nftId: Joi.string().required(),
  initialBidAmount: Joi.string(),
  startDate: Joi.date(),
  closeDate: Joi.date(),
  //   bidIncrementAmount: Joi.string().required(),
});
const updateAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { nftId, initialBidAmount, startDate, closeDate } = req.body;
    const checkNftExist = await findOne("nft", { _id: nftId });
    if (!checkNftExist) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft does not exist" });
    }
    const checkOwnerAndNft = findOne("nft", { _id: nftId, owner: req.userId });
    if (!checkOwnerAndNft) {
      return res
        .status(400)
        .json({ status: 400, message: "You are not the owner of this nft" });
    }
    const data = {
      initialBidAmount,
      startDate,
      closeDate,
    };
    const updateNft = await updateDocument("nft", { _id: nftId }, { ...data });
    return res
      .status(200)
      .json({ status: 200, updateNft, message: "Your Nft is now on auction" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = updateAuction;
