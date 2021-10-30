import { getUsersCollection } from "../../services/mongodb/index.js";
import { ObjectId } from "mongodb";

export const resolvers = {
   Query: {
      user: async (parent, args, { req }, info) => {
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
      }
   }
};