const Joi = require("joi");
const {
  findOne,
  customUpdate,
  insertNewDocument,
} = require("../../../../helpers");


const schema = Joi.object({
  action: Joi.boolean().required(),
  userId: Joi.string().required(), // my id
  profileId: Joi.string().required(), // second user id

});

const follow = async (req, res) => {
  try {
    console.log("hello world");
    await schema.validateAsync(req.body);
    const { action, userId, profileId } = req.body;
    console.log(req.body);

    const user = await findOne("user", { _id: userId });


    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "User doesn't exist" });
    }

    if (user._id == profileId) {
      return res
        .status(400)
        .send({ status: 400, message: "You can't follow yourself" });
    }



    const followUser = await findOne("user", { _id: profileId });
    if (!followUser) {
      return res
        .status(400)
        .send({ status: 400, message: "No followers found" });
    }

    if (action == true) {


      const check_following = await findOne("follower", {
        profileId: userId,
        following: profileId,
      });
    
      const check_followed = await findOne("follower", {
        profileId,
        followers: userId,
      });
      console.log(check_followed,"hello1");

      if (check_followed || check_following) {
        return res
          .status(200)
          .json({ status: 200, message: "You are already followed" });
      }

      const following = await insertNewDocument("follower", {
        profileId: userId,
        following: profileId,
      
      });


      console.log(following,"following");
      const followed = await insertNewDocument("follower", {
        profileId,
        followers: userId,
        
      });

      console.log(followed,"followed");

      return res.status(200).json({ status: 200, message: "You are followed" });
    }

    if (action == false) {
      const unFollow = await customUpdate(
        "follower",
        {profileId: userId },
        { $pull: { following: profileId } }
      );
      console.log(unFollow, "unFollow");
      // For Updating My Following
      const userUnFollow = await customUpdate(
        "follower",
        { profileId },
        { $pull: { followers: userId } }
      );
      console.log(userUnFollow, "userUnFollow");
      return res.status(200).send({ status: 200, message: false });
    }

    // // For Updating User Followers
    // const unFollow = await customUpdate(
    //   "user",
    //   { _id },
    //   { $pull: { followers: userId } }
    // );
    // console.log(unFollow, "unFollow");
    // // For Updating My Following
    // const userUnFollow = await customUpdate(
    //   "user",
    //   { _id: userId },
    //   { $pull: { following: _id } }
    // );
    // console.log(userUnFollow, "userUnFollow");
    //      return res.status(200).send({ status: 200, message: false });
  } catch (e) {
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = follow;
