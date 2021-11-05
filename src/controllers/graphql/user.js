const { getUserDevices } = require("./utils/devices");
const { getUserPreferences } = require("./utils/preferences");

module.exports.resolvers = {
   User: {
      devices: async (parent, args, context, info) => {
         const { req } = context;
         return getUserDevices(req);
      },
      preferences: async (parent, args, context, info) => {
         const { req } = context;
         return getUserPreferences(req);
      }
   }
};
