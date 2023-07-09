const Joi = require("joi");
const { updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  id: Joi.string().required(),
});

const updateNfts = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { id } = req.params;
    const nft = await updateDocument(
      "nft",
      {
        _id: id,
      },
      {
        ...req.body,
      }
    );
    return res.status(200).send({
      status: 200,
      nft,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateNfts;
