const { sendSms } = require("services/twilio");

module.exports.sendOneTImeCodeSms = async (req, phoneNumber, code) => {
   const message = `Your Budgeter verification code is: ${code}`;
   await sendSms(req, phoneNumber, message);
};
