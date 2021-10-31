const sendgridMail = require("@sendgrid/mail");
const { BudgeterError } = require("lib/middleware/error");
const { getConfig } = require("config");

module.exports.getClient = (req) => {
   try {
      req.logger.info("Sendgrid service: attempting to set connection");
      sendgridMail.setApiKey(getConfig("SENDGRID_API_KEY"));
      return sendgridMail;
   }
   catch(error) {
      throw new BudgeterError(400, "Downstream error: Sendgrid connection error", error);
   }
};