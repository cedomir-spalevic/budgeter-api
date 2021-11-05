const { getAllPaymentTags } = require("./utils/paymentTags");
const { findUserById } = require("./utils/user");

module.exports.resolvers = {
   Query: {
      user: async (parent, args, context, info) => {
         const { req } = context;
         return findUserById(req);
      },
      paymentTags: async (parent, args, context, info) => {
         const { req } = context;
         return getAllPaymentTags(req);
      }
   }
};
