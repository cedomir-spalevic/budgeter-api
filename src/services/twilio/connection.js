import Twilio from "twilio";
import { BudgeterError } from "../../lib/middleware/error.js";

let client = null;

export const getClient = (req) => {
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