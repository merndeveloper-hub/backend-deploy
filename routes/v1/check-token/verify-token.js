const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { SECRET } = require("../../../config");
const { findOneAndPopulate } = require("../../../helpers");

const schema = Joi.object({
  token: Joi.string().required(),
});

const verifyToken = async (req, res, next) => {
  try {
    await schema.validateAsync(req.query);
    const { token } = req.query;
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ status: 401, message: "Token Unauthorized!" });
      }

      const isUserExist = await findOneAndPopulate(
        "user",
        { _id: decoded.id },
        "type"
      );

      if (!isUserExist) {
        return res.status(404).send({
          status: 404,
          message: "No longer User exists with your token",
        });
      }
      isUserExist.password = undefined;
      // isUserExist.type = undefined;
      return res
        .status(200)
        .send({ status: 200, message: "Authorized", user: isUserExist });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = verifyToken;
