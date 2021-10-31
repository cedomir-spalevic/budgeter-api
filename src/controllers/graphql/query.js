const { findUserById } = require("./utils");

module.exports.resolvers = {
   Query: {
      user: async (parent, args, context, info) => {
         const { req } = context;
         return findUserById(req);
      }
   }
};