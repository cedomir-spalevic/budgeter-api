import sendgridMail from "@sendgrid/mail";
import { BudgeterError } from "../../lib/middleware/error.js";

export const getClient = (req) => {
   try {
      req.logger.info("Sendgrid service: attempting to set connection");
      sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
      return sendgridMail;
   }
   catch(error) {
      throw new BudgeterError(400, "Downstream error: Sendgrid connection error", error);
   }
};