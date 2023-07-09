const { findOne } = require("../../../../helpers");
const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await findOne("user", { _id: id });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    }
    user.password = undefined;
    return res.status(200).send({ status: 200, profile: user });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};
module.exports = getProfile;
