const { STRIPE_SECRET_KEY, SECRET } = require("../../../../config");
const {
  findOneSort,
  insertNewDocument,
  findOne,
  updateDocument,
} = require("../../../../helpers");
const jwt = require("jsonwebtoken");
const xrpl = require("xrpl");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const cloudinary = require("cloudinary").v2;
// const fs = require("fs");

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9@$!%*#?&]{6,30}$"))
    .required(),
  wallet_address: Joi.string(),
});

const addUserInfo = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email, first_name, last_name, password, wallet_address } = req.body;
    const check_email_exist = await findOne("user", { email });
    if (check_email_exist) {
      return res
        .status(404)
        .send({ status: 404, message: "This Email is already reserverd" });
    }
    const customer = await stripe.customers.create({
      description: "my application user " + first_name + " " + last_name,
      name: first_name + " " + last_name,
      email,
    });
    var data = {
      stripe_customer_id: customer.id,
      first_name,
      last_name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    };
    if (req.files) {
      if (req?.files?.profile?.path) {
        const profile = await cloudinary.uploader.upload(
          req?.files?.profile?.path
        );
        data.profile = profile.url;
        // fs.unlinkSync(req.files.profile[0].path);
        console.log(profile);
      }
      if (req?.files?.profile_banner?.path) {
        const profile_banner = await cloudinary.uploader.upload(
          req?.files?.profile_banner?.path
        );
        data.profile_banner = profile_banner.url;
        // fs.unlinkSync(req.files.profile_banner[0].path);
        console.log(profile_banner);
      }
    }
    if (wallet_address) {
      const getUser = await findOne("user", { wallet_address });
      if (!getUser) {
        return res.status(400).send({
          status: 400,
          message: "Wallet address not exist",
        });
      }
      const updateUser = await updateDocument("user", { wallet_address }, data);
      var token = jwt.sign({ id: updateUser._id }, SECRET);
      return res.status(200).send({
        status: 200,
        token,
        message: "User Updated Successfully",
        user: updateUser,
      });
    }
    const wallet = xrpl.Wallet.generate();
    data.account_public_key = wallet.publicKey;
    data.account_private_key = wallet.privateKey;
    data.wallet_address = wallet.classicAddress;
    data.account_seeds = wallet.seed;
    const newUser = await insertNewDocument("user", data);
    var token = jwt.sign({ id: newUser._id }, SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).send({
      status: 200,
      token,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = addUserInfo;
