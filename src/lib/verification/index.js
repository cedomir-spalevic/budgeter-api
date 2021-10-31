const { EMAIL_USER_IDENTIFIER_TYPE, PHONE_USER_IDENTIFIER_TYPE } = require("utils/constants");
const { BudgeterError } = require("lib/middleware/error");
const { sendOneTimeCodeEmail } = require("./email");
const { sendOneTImeCodeSms } = require("./sms");

module.exports.sendOneTimeCodeVerification = async (req, { userIdentifier, userIdentifierType, code }) => {
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