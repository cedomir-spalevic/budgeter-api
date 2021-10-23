import { BudgeterError } from "../middleware/error.js";
import { sendOneTimeCodeEmail } from "./email.js";
import { sendOneTImeCodeSms } from "./sms.js";

export const sendOneTimeCodeVerification = async (req, { email, phoneNumber, type, code }) => {
   switch(type) {
      case "email": 
         await sendOneTimeCodeEmail(req, email, code);
         break;
      case "phone":
         await sendOneTImeCodeSms(req, phoneNumber, code);
         break;
      default:
         throw new BudgeterError(400, "Verification lib: invalid type");
   }
};