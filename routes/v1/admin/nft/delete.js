const Joi = require("joi");
const { deleteDocument, findOne } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const deleteNft = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const checkNft = await findOne("nft", { _id: id });
    if (!checkNft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    const nft = await deleteDocument("nft", {
      _id: id,
    });
    return res.status(200).send({
      status: 200,
      nft,
      message: "Nft deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = deleteNft;
