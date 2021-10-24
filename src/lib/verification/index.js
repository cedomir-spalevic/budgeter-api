import { EMAIL_USER_IDENTIFIER_TYPE, PHONE_USER_IDENTIFIER_TYPE } from "../../utils/constants.js";
import { BudgeterError } from "../middleware/error.js";
import { sendOneTimeCodeEmail } from "./email.js";
import { sendOneTImeCodeSms } from "./sms.js";

export const sendOneTimeCodeVerification = async (req, { userIdentifier, userIdentifierType, code }) => {
   switch(userIdentifierType) {
      case EMAIL_USER_IDENTIFIER_TYPE: 
         await sendOneTimeCodeEmail(req, userIdentifier, code);
         break;
      case PHONE_USER_IDENTIFIER_TYPE:
         await sendOneTImeCodeSms(req, userIdentifier, code);
         break;
      default:
         throw new BudgeterError(400, "Verification lib: invalid type");
   }
};