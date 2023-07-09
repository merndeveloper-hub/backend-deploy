const mongoose = require("mongoose");
const schemaType = require("../../types");

const nftSchema = new mongoose.Schema(
  {
    title: {
      type: schemaType.TypeString,
    },
    description: {
      type: schemaType.TypeString,
    },
    Flags: {
      type: schemaType.TypeNumber,
    },
    Issuer: {
      type: schemaType.TypeString,
    },
    NFTokenID: {
      type: schemaType.TypeString,
      // unique: true,
    },
    NFTokenTaxon: {
      type: schemaType.TypeNumber,
    },
    TransferFee: {
      type: schemaType.TypeNumber,
    },
    URI: {
      type: schemaType.TypeString,
    },
    nft_serial: {
      type: schemaType.TypeNumber,
    },
    nftType: {
      type: schemaType.TypeString,
      default: "mint",
    },
    amount: {
      type: schemaType.TypeString,
    },
    flags: {
      type: schemaType.TypeNumber,
    },
    nft_offer_index: {
      type: schemaType.TypeString,
    },
    Memos: {
      type: schemaType.TypeArray,
    },
    nft_img: {
      type: schemaType.TypeString,
    },
    pinataImgUrl: {
      type: schemaType.TypeString,
    },
    pinataMetaDataUrl: {
      type: schemaType.TypeString,
    },
    royality: {
      type: schemaType.TypeString,
    },
    // tags: {
    //   type: schemaType.TypeArray,
    //   enum: [
    //     "Art",
    //     "Music",
    //     "Collectibles",
    //     "Sports",
    //     "Motion",
    //     "Metaverse",
    //     "Trading Cards",
    //     "Others",
    //     "Photography",
    //     "Utility",
    //     "Virtual Worlds",
    //   ],
    //   required: true,
    // },
    tags: [
      {
        // value: {
        type: schemaType.TypeString,
        required: true,
        // },
        enum: [
          "Art",
          "Music",
          "Collectibles",
          "Sports",
          "Motion",
          "Metaverse",
          "Trading Cards",
          "Others",
          "Photography",
          "Utility",
          "Virtual Worlds",
        ],
      },
    ],
    showNft: {
      type: schemaType.TypeBoolean,
      default: true,
      enum: [true, false],
    },
    // password: {
    //   type: schemaType.TypeString,
    // },
    // your_site: {
    //   type: schemaType.TypeString,
    // },
    // twitter: {
    //   type: schemaType.TypeString,
    // },
    // instagram: {
    //   type: schemaType.TypeString,
    // },
    // profile: {
    //   type: schemaType.TypeString,
    // },
    // profile_banner: {
    //   type: schemaType.TypeString,
    // },

    // status: {
    //   type: schemaType.TypeString,
    //   default: "Active",
    // },
    // type: {
    //   type: schemaType.ObjectID,
    //   ref: "user-types",
    // },
    // job_id: {
    // 	type: schemaType.TypeString
    // },
    created_date: {
      type: schemaType.TypeDate,
      default: Date.now,
    },
    created_by: {
      type: schemaType.TypeObjectId,
      ref: "users",
    },
    owner: {
      type: schemaType.TypeObjectId,
      ref: "users",
    },
    // locations: {
    // 	type: [schemaType.TypeObjectId],
    // 	ref: "location"
    // }
    initialBidAmount: {
      type: schemaType.TypeString,
    },
    bidIncrementAmount: {
      type: schemaType.TypeString,
    },
    startDate: {
      type: schemaType.TypeDate,
    },
    closeDate: {
      type: schemaType.TypeDate,
    },
    expire: {
      type: schemaType.TypeBoolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = nftSchema;
