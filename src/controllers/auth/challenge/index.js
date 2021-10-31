const { isPhoneNumber, normalizePhoneNumber } = require("lib/phoneNumber");
const { isEmail } = require("lib/email");
const { BudgeterError } = require("lib/middleware/error");
const { generateOneTimeCode, getExpirationLength } = require("lib/security/oneTimeCode");
const { getOneTimeCodesCollection } = require("services/mongodb");
const { sendOneTimeCodeVerification } = require("lib/verification");
const { EMAIL_USER_IDENTIFIER_TYPE, PHONE_USER_IDENTIFIER_TYPE } = require("utils/constants");

const getCode = (req) => {
   if(!req.body || req.body.userIdentifier === undefined) {
      req.logger.error("No user identifier found");
      throw new BudgeterError(400, "userIdentifier is required"); 
   }

   let type = null;
   let userIdentifier = req.body.userIdentifier ? req.body.userIdentifier.toString() : "@";
   if(userIdentifier.includes("@")) {
      if(!isEmail(userIdentifier)) {
         req.logger.error(`Invalid email = ${userIdentifier}`);
         throw new BudgeterError(400, "email is not valid");
      }
      userIdentifier = userIdentifier.toLowerCase().trim();
      type = EMAIL_USER_IDENTIFIER_TYPE;
      req.logger.info(`Email provided = ${userIdentifier}`);
   }
   else {
      if(!isPhoneNumber(userIdentifier)) {
         req.logger.error(`Invalid phone number = ${userIdentifier}`);
         throw new BudgeterError(400, "phoneNumber is not valid");
      }
      userIdentifier = normalizePhoneNumber(userIdentifier);
      type = PHONE_USER_IDENTIFIER_TYPE;
      req.logger.info(`Phone number provided = ${userIdentifier}`);
   }

   return generateOneTimeCode(req, userIdentifier, type);
};

const challenge = async (req, res, next) => {
   const oneTimeCode = getCode(req);
   const oneTimeCodesCollection = await getOneTimeCodesCollection(req);
   await oneTimeCodesCollection.create(oneTimeCode);
   await sendOneTimeCodeVerification(req, oneTimeCode);
   res.json({
      expires: getExpirationLength(),
      key: oneTimeCode.key
   });
};

module.exports = challenge;