const jwt = require("jsonwebtoken");
const { SECRET } = require("../../config");
const { findOne, findOneAndPopulate } = require("../../helpers");

const adminVerification = async (req, res, next) => {
  try {
    let token = req.headers["token"];
    if (!token) {
      return res
        .status(404)
        .send({ status: 404, message: "No token provided!" });
    }
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .send({ status: 400, message: "Token Unauthorized!" });
      }
      if (!decoded.id) {
        return res
          .status(400)
          .send({ status: 400, message: "No id found in token" });
      }
      const isUserExist = await findOneAndPopulate(
        "user",
        { _id: decoded.id },
        "type"
      );
      if (!isUserExist) {
        return res.status(404).send({
          status: 404,
          message: "User does not exist with your token",
        });
      }
      const checkType = await findOne("userType", {
        _id: isUserExist.type,
      });
      if (!checkType) {
        return res.status(400).send({
          status: 400,
          message: "No user-type found",
        });
      }
      console.log(checkType);
      const accessArr = ["Owner", "Admin", "Moderator", "Creator", "Director"];
      if (!accessArr.includes(checkType.type)) {
        return res.status(400).send({
          status: 400,
          message: "You are not authorized to access this route",
        });
      }
      req.userId = isUserExist._id;
      req.user = isUserExist;
      next();
    });
  } catch (e) {
    console.log("Token verification Error", e.message);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = { adminVerification };
