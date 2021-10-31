const Twilio = require("twilio");
const { BudgeterError } = require("lib/middleware/error");

let client = null;

module.exports.getClient = (req) => {
   if(!client) {
      try {
         req.logger.info("Sendgrid service: attempting to set connection");
         client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY);
      }
      catch(error) {
         throw new BudgeterError(400, "Downstream error: Twilio connection error", error);
      }
   }
   return client;
};