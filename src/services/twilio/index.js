const { getClient } = require("./connection");
const { BudgeterError } = require("lib/middleware/error");
const { getConfig } = require("config");

module.exports.sendSms = async (req, phoneNumber, text) => {
   const client = await getClient(req);

   try {
      req.logger.info(
         `Twilio service: attempting to send SMS: To = ${phoneNumber}, Text = ${text}`
      );
      const response = await client.messages.create({
         body: text,
         from: getConfig("TWILIO_PHONE_NUMBER"),
         to: phoneNumber
      });
      req.logger.info("Twilio service: SMS response");
      req.logger.info(response);
   } catch (error) {
      throw new BudgeterError(400, "Downstream error: Twilio SMS error", error);
   }
};
