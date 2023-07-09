const cloudinary = require("cloudinary").v2;

// const { unlinkSync } = require("fs");
const Joi = require("joi");
const { updateDocument } = require("../../../../helpers");

const schema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
});

const updateAdminProfile = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    if (req?.files?.profile?.path) {
      const profile_image = await cloudinary.uploader.upload(
        req?.files?.profile?.path
      );
      req.body.profile = profile_image.url;
    }
    const user = await updateDocument(
      "user",
      {
        _id: req.userId,
      },
      {
        ...req.body,
      }
    );
    user.following = undefined;
    user.followers = undefined;
    user.password = undefined;
    // unlinkSync(req.file.path);
    return res.status(200).send({
      status: 200,
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateAdminProfile;
