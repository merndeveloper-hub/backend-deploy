const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const blogCommentSchema = new mongoose.Schema(
  {
    name: {
      type: SchemaType.TypeString,
      trim: true,
      // required: true,
    },
    email: {
      type: SchemaType.TypeString,
      trim: true,
      // required: true,
    },
    text: {
      type: SchemaType.TypeString,
      trim: true,
      // required: true,
    },
    blog_id: {
      type: SchemaType.ObjectID,
      ref: "blog",
    },
    commentDate: {
      type: SchemaType.TypeDate,
      default: Date.now,
    },
    user_id: {
      type: SchemaType.ObjectID,
      ref: "users",
    },
    preferred_method: {
      type: SchemaType.TypeString,
      enum: ["User", "Public"],
    },
    approve: {
      type: SchemaType.TypeBoolean,
      enum: [true, false],
    },
    // reply: {
    //   type: SchemaType.TypeArray,
    //   default: [],
    // },
    reply: [
      {
        text: {
          type: SchemaType.TypeString,
        },
        name: {
          type: SchemaType.TypeString,
        },
        email: {
          type: SchemaType.TypeString,
        },
        id: {
          type: SchemaType.ObjectID,
          ref: "users",
          // required: true,
        },
        createdAt: {
          type: SchemaType.TypeDate,
          default: Date.now,
        },
      },
    ],

    // publish: {
    //   type: SchemaType.TypeBoolean,
    //   default: false,
    //   enum: [true, false],
    // },
  },
  { timestamps: true }
);

module.exports = blogCommentSchema;
