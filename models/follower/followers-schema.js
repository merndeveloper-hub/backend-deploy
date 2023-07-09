const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const followSchema = new mongoose.Schema({
    profileId:{
        type: SchemaType.ObjectID,
        ref: "users"
    },
    followers:[
        {
            type:SchemaType.ObjectID,
            ref:"users",
        }
    ],
        following: [
			{
			  type: SchemaType.ObjectID,
			  ref: "users",
			},
		  ],
    
});

module.exports = followSchema;