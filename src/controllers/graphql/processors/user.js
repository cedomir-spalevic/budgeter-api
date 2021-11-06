const { getUsersCollection } = require("services/mongodb");

const findUserById = async (req) => {
   const usersCollection = await getUsersCollection(req);
   const user = await usersCollection.find({
      id: req.user.id
   });
   return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn
   };
};

module.exports = {
   findUserById
};
