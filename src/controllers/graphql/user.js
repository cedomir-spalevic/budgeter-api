const { getUserDevices } = require("./processors/devices");
const { getUserPreferences } = require("./processors/preferences");

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
