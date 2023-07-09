const { findOne, updateDocument } = require("../../../../helpers");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
// const fs = require("fs");

const schema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$")),
});

const updateProfile = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { password } = req.body;
    const check_user = await findOne("user", { _id: req.userId });
    if (!check_user) {
      return res.status(400).send({ status: 400, message: "User not found" });
    }
    if (req.files) {
      if (req?.files?.profile?.path) {
        const profile = await cloudinary.uploader.upload(
          req?.files?.profile?.path
        );
        req.body.profile = profile.url;
        // fs.unlinkSync(req.files.profile[0].path);
        console.log(profile);
      }
      if (req?.files?.profile_banner?.path) {
        const profile_banner = await cloudinary.uploader.upload(
          req?.files?.profile_banner?.path
        );
        req.body.profile_banner = profile_banner.url;
        // fs.unlinkSync(req.files.profile_banner[0].path);
        console.log(profile_banner);
      }
    }
    if (password?.length) {
      req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
    const update = await updateDocument("user", { _id: req.userId }, req.body);
    update.password = undefined;
    console.log("updare", update);
    return res.status(200).send({
      status: 200,
      message: "Profile Updated Successfully",
      user: update,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateProfile;
