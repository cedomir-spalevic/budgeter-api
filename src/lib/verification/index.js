import { BudgeterError } from "../middleware/error.js";
import { sendEmail } from "./email.js";
import { sendSms } from "./sms.js";

export const sendVerification = async ({ email, phoneNumber, type }) => {
   switch(type) {
      case "email": 
         await sendEmail(email);
         break;
      case "phone":
         await sendSms(phoneNumber);
         break;
      default:
         throw new BudgeterError(500, "Incorrect type for verification");
   }
};