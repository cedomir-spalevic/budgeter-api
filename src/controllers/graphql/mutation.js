const { removeDevice, addDevice } = require("./processors/devices");
const { addPaymentTag, removePaymentTag } = require("./processors/paymentTags");
const { updateUserPreferences } = require("./processors/preferences");
const { addPayment, removePayment } = require("./processors/payments");
const { addIncome, removeIncome } = require("./processors/incomes");

const tryMutation = async (req, processor, errorMessage, entityProperty) => {
   let message = "",
      success = true,
      processorResponse = {};
   try {
      processorResponse = await processor();
   } catch (error) {
      req.logger.error(`Error during tryMutation: ${errorMessage}`);
      req.logger.error(error);
      message = errorMessage;
      success = false;
   }
   return {
      message,
      success,
      [entityProperty]: success ? processorResponse : null
   };
};

const getMutationResolver = (processor, errorMessage, entityProperty) => {
   return async (parent, args, context) => {
      const { req } = context;
      return await tryMutation(
         req,
         processor(req, args),
         errorMessage,
         entityProperty
      );
   };
};

module.exports.resolvers = {
   Mutation: {
      // Device
      addDevice: getMutationResolver(
         (req, args) => async () => addDevice(req, args.device),
         "Unable to add device",
         "devices"
      ),
      removeDevice: getMutationResolver(
         (req, args) => async () => removeDevice(req, args.device),
         "Unable to remove device",
         "devices"
      ),

      // User preferences
      updateUserPreferences: getMutationResolver(
         (req, args) => async () =>
            updateUserPreferences(req, args.preferences),
         "Unable to update preferences",
         "preferences"
      ),

      // Payment Tags
      addPaymentTag: getMutationResolver(
         (req, args) => async () => addPaymentTag(req, args.paymentTag),
         "Unable to create payment tag",
         "paymentTag"
      ),
      removePaymentTag: getMutationResolver(
         (req, args) => async () => removePaymentTag(req, args.id),
         "Unable to remove payment tag",
         "paymentTag"
      ),

      // Payments
      addPayment: getMutationResolver(
         (req, args) => async () => addPayment(req, args.payment),
         "Unable to create payment",
         "payment"
      ),
      removePayment: getMutationResolver(
         (req, args) => async () => removePayment(req, args.id),
         "Unable to remove payment",
         "payment"
      ),

      // Incomes
      addIncome: getMutationResolver(
         (req, args) => async () => addIncome(req, args.income),
         "Unable to create income",
         "income"
      ),
      removeIncome: getMutationResolver(
         (req, args) => async () => removeIncome(req, args.id),
         "Unable to remove income",
         "income"
      )
   }
};
