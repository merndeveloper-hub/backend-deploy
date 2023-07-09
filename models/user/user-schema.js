const mongoose = require("mongoose");
const schemaType = require("../../types");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: schemaType.TypeString,
      // required: true,
    },
    last_name: {
      type: schemaType.TypeString,
      // required: true,
    },
    phone_no: {
      type: schemaType.TypeNumber,
      // required: true,
    },
    wallet_address: {
      type: schemaType.TypeString,
      // unique: true
    },
    account_public_key: {
      type: schemaType.TypeString,
      // unique: true
    },
    account_private_key: {
      type: schemaType.TypeString,
      // unique: true
    },
    account_seeds: {
      type: schemaType.TypeString,
      // unique: true
    },
    card_holder_name: {
      type: schemaType.TypeString,
      // unique: true
    },
    credit_card: {
      type: schemaType.TypeString,
      // unique: true
    },
    username: {
      type: schemaType.TypeString,
      // required: true,
    },
    custom_url: {
      type: schemaType.TypeString,
      // required: true,
    },
    bio: {
      type: schemaType.TypeString,
      // required: true,
    },
    email: {
      type: schemaType.TypeString,
      // required: true,
      // unique: true
    },
    password: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_customer_id: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_payment_method_id: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_card_number: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_card_exp_month: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_card_exp_year: {
      type: schemaType.TypeString,
      // required: true,
    },
    stripe_card_cvc: {
      type: schemaType.TypeString,
      // required: true,
    },
    your_site: {
      type: schemaType.TypeString,
    },
    twitter: {
      type: schemaType.TypeString,
    },
    instagram: {
      type: schemaType.TypeString,
    },
    discord: {
      type: schemaType.TypeString,
    },
    facebook: {
      type: schemaType.TypeString,
    },
    profile: {
      type: schemaType.TypeString,
    },
    profile_banner: {
      type: schemaType.TypeString,
    },
    connect_wallet: {
      type: schemaType.TypeBoolean,
      default: false,
    },
    status: {
      type: schemaType.TypeString,
      default: "Active",
      enum: ["Active", "Disable"],
    },
    type: {
      type: schemaType.ObjectID,
      ref: "user-types",
    },
    // job_id: {
    // 	type: schemaType.TypeString
    // },
    created_date: {
      type: schemaType.TypeDate,
      default: Date.now,
    },
    xumm_token: {
      type: schemaType.TypeString,
    },
    xumm_scan: {
      type: schemaType.TypeBoolean,
      default: false,
    },
    // locations: {
    // 	type: [schemaType.TypeObjectId],
    // 	ref: "location"
    // }
  },
  { timestamps: true }
);

module.exports = userSchema;
