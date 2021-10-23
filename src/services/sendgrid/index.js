import { getClient } from "./connection.js";
import { BudgeterError } from "../../lib/middleware/error.js";

export const sendEmail = async (req, to, subject, html) => {
   const client = getClient(req);

   try {
      const data = {
         to,
         subject,
         html,
         from: process.env.SENDGRID_FROM_EMAIL,
      };
      req.logger.info(`Sendgrid service: attempting to send email: To = ${to}, Subject = ${subject}`);
      const response = await client.send(data);
      req.logger.info("Sendgrid service: email response");
      req.logger.info(response);
   }
   catch(error) {
      throw new BudgeterError(400, "Downstream error: Send email error", error);
   }
};