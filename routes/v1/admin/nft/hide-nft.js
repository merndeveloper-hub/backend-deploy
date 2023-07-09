const Joi = require("joi");
const { findOne, updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
  showNft: Joi.boolean().required(),
});

const hideNftOrShow = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { id, showNft } = req.query;
    const findNft = await findOne("nft", { _id: id });
    if (!findNft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    // const checkNftStatus = await findOne("nft", { _id: id, showNft });
    // if (checkNftStatus) {
    //   return res.status(400).send({ status: 400, message: "NFT not found" });
    // }
    const updateNft = await updateDocument("nft", { _id: id }, { showNft });
    return res
      .status(200)
      .send({ status: 200, message: "NFT updated Successfully", updateNft });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};
module.exports = hideNftOrShow;
