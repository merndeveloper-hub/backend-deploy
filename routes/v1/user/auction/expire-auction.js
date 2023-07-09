const Joi = require("joi");
const { findOne } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const expireAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    // console.log(id);
    const checkNftExist = await findOne("nft", { _id: id });
    if (!checkNftExist) {
      return res
        .status(400)
        .json({ status: 400, message: "Nft does not exist" });
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

    const todayDate = new Date();
    const closeDate = new Date(checkExpire.closeDate);
    if (
      checkExpire.expire === false &&
      todayDate.getTime() > closeDate.getTime()
    ) {
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
        message: "Auction has been expired",
        updateAuction,
      });
    }
    return res
      .status(400)
      .json({ status: 400, message: "Auction not expire yet" });
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = expireAuction;
