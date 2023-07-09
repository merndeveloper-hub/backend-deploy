const Joi = require("joi");
const { findOne, updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const removeFromAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    console.log(id);
    const checkNftExist = await findOne("nft", { _id: id });
    if (!checkNftExist) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft does not exist" });
    }
    const checkNftOwner = await findOne("nft", { _id: id, owner: req.userId });
    if (!checkNftOwner) {
      return res
        .status(400)
        .json({ status: 400, message: "You do not own this nft" });
    }
    const checkInAuction = await findOne("nft", {
      _id: id,
      nftType: "auction",
    });
    if (!checkInAuction) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft is not on auction" });
    }
    const checkExpire = await findOne("nft", {
      _id: id,
      nftType: "auction",
      expire: false,
    });
    if (!checkExpire) {
      return res
        .status(400)
        .json({ status: 400, message: "Auction have been expired" });
    }

    const updateAuction = await updateDocument(
      "nft",
      { _id: id },
      {
        nftType: "mint",
        expire: true,
      }
    );
    return res.status(200).json({
      status: 200,
      message: "Nft has been removed from auction",
      updateAuction,
    });
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = removeFromAuction;
