const Joi = require("joi");
const { findOne, deleteDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const cancelABid = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;

    const checkBid = await findOne("bid", {
      _id: id,
    });
    if (!checkBid) {
      return res.status(400).json({ status: 400, message: "No bid found" });
    }
    const checkBidUser = await findOne("bid", {
      _id: id,
      bidder_id: req.userId,
    });
    if (!checkBidUser) {
      return res
        .status(400)
        .json({ status: 400, message: "This bid not belong to you" });
    }
    await deleteDocument("bid", { _id: id });
    return res
      .status(200)
      .json({ status: 200, message: "Bid deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};
module.exports = cancelABid;
