const { getUsersCollection } = require("services/mongodb");
const { ObjectId } = require("mongodb");

const findUserById = async (req) => {
   const usersCollection = await getUsersCollection(req);
   const user = await usersCollection.find({
      _id: ObjectId(req.user.id)
   });
   return {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn
   };
};

module.exports = {
   findUserById
};