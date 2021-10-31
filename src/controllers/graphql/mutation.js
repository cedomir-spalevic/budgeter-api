const { removeDevice, addDevice } = require("./utils/device");
const { updateUserPreferences } = require("./utils/preferences");

const tryMutation = async (req, asyncFunc, errorMessage) => {
   let message = "", success = true, funcResponse = {};
   try {
      funcResponse = await asyncFunc();
   }
   catch(error) {
      req.logger.error(`Error during tryMutation: ${errorMessage}`);
      req.logger.error(error);
      message = errorMessage;
      success = false;
   }
   return {
      message,
      success,
      funcResponse
   };
};

module.exports.resolvers = {
   Mutation: {
      addDevice: async (parent, args, context, info) => {
         const { req } = context;
         const asyncFunc = async () => addDevice(req, args.device);
         const response = await tryMutation(req, asyncFunc, "Unable to add device");
         return {
            success: response.success,
            message: response.message,
            devices: response.success ? response.funcResponse : null
         };
      },
      removeDevice: async (parent, args, context, info) => {
         const { req } = context;
         const asyncFunc = async () => removeDevice(req, args.device);
         const response = await tryMutation(req, asyncFunc, "Unable to remove device");
         return {
            success: response.success,
            message: response.message,
            devices: response.success ? response.funcResponse : null
         };
      },
      updateUserPreferences: async (parent, args, context, info) => {
         const { req } = context;
         const asyncFunc = async () => updateUserPreferences(req, args.preferences);
         const response = await tryMutation(req, asyncFunc, "Unable to update preferences");
         return {
            success: response.success,
            message: response.message,
            preferences: response.success ? response.funcResponse : null
         };
      }
   }
};