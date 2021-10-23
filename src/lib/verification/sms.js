import { sendSms } from "../../services/twilio/index.js";

export const sendOneTImeCodeSms = async (req, phoneNumber, code) => {
   const message = `Your Budgeter verification code is: ${code}`;
   await sendSms(req, phoneNumber, message);
};