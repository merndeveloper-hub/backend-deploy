const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: SchemaType.TypeString,
    },
    blogImage: {
      type: SchemaType.TypeString,
    },
    blogDescription: {
      type: SchemaType.TypeString,
    },
    blogData: {
      type: SchemaType.TypeString,
    },
    blogDate: {
      type: SchemaType.TypeDate,
      default: Date.now,
    },
    blogTags: {
      type: SchemaType.TypeArray,
      default: [],
    },
    userId: {
      type: SchemaType.ObjectID,
      ref: "users",
    },
    publish: {
      type: SchemaType.TypeBoolean,
      default: false,
      enum: [true, false],
    },
    comments: [
      {
        type: SchemaType.ObjectID,
        ref: "blogComment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = blogSchema;
