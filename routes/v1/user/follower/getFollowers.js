const Joi = require("joi");
const {
  findOne, insertNewDocument,
} = require("../../../../helpers");

const schema = Joi.object({
  userId: Joi.string().required(),
  _id: Joi.string().required(),
})


const checkFollow = async (req, res) => {
  try {
   await schema.validateAsync(req.query);

    const { userId } = req.query
    const _id = req.query.id;
    //console.log(req.userId);
    if (_id === userId) {
      return res
        .status(200)
        .send({ status: 400, message: "You can't follow yourself" });
    }
    const find_user = await findOne("user", { _id });
    if (!find_user) {
      return res.status(400).send({ status: 400, message: "No user found" });
    }
    

      const check_followed = await findOne("user", {
        userId,
        followers: {
          $in: [_id],
        },
      });
      if (check_followed) {
        return res
          .status(200)
          .send({ status: 200, message: "Already Followed" });
      }
     
      const followed = await insertNewDocument("user",{followers: userId});
      console.log('followed', followed );
    
      
      return res
        .status(200)
        .send({ status: 200, message: "User Following Successfully" });
    
  
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = checkFollow;
