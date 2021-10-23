import { EMAIL_USER_IDENTIFIER_TYPE, PHONE_USER_IDENTIFIER_TYPE } from "../../utils/constants.js";
import { BudgeterError } from "../middleware/error.js";
import { sendOneTimeCodeEmail } from "./email.js";
import { sendOneTImeCodeSms } from "./sms.js";

export const sendOneTimeCodeVerification = async (req, { email, phoneNumber, type, code }) => {
   switch(type) {
      case EMAIL_USER_IDENTIFIER_TYPE: 
         await sendOneTimeCodeEmail(req, email, code);
         break;
      case PHONE_USER_IDENTIFIER_TYPE:
         await sendOneTImeCodeSms(req, phoneNumber, code);
         break;
      default:
         throw new BudgeterError(400, "Verification lib: invalid type");
   }
};