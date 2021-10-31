const { getDevicesCollection, getPreferencesCollection } = require("services/mongodb");
const { getUserDevices, getUserPreferences } = require("./utils/user.js");

module.exports.resolvers = {
   User: {
      devices: async (parent, args, context, info) => {
         const { req } = context;
         return getUserDevices(req);
      },
      preferences: async function(parent, args, context, info) {
         const { req } = context;
         return getUserPreferences(req);
      }
   }
};