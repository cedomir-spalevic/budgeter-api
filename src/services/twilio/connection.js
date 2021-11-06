const Twilio = require("twilio");
const { BudgeterError } = require("lib/middleware/error");
const { getConfig } = require("config");

let client = null;

module.exports.getClient = (req) => {
   if (!client) {
      try {
         req.logger.info("Sendgrid service: attempting to set connection");
         client = new Twilio(
            getConfig("TWILIO_ACCOUNT_SID"),
            getConfig("TWILIO_API_KEY")
         );
      } catch (error) {
         throw new BudgeterError(
            400,
            "Downstream error: Twilio connection error",
            error
         );
      }
   }
   return client;
};
