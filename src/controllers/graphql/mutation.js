const { getDevicesCollection, getPreferencesCollection } = require("services/mongodb");
const { findUserById } = require("./utils");

module.exports.resolvers = {
   Mutation: {
      updateUser: async function(parent, args, context, info) {
         const { req } = context;
         const updatePreferences = async () => {
            if(!args.preferences) return;
         };
         const updateDevices = async () => {
            if(!args.devices) return;
         };
         const getUser = async () => await findUserById(req);
         const results = await Promise.all([updateDevices, updatePreferences, getUser]);

      }
   }
};