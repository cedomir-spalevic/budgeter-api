import { isEmail, isPhoneNumber } from "../../utils/validators.js";
import { normalizePhoneNumber, normalizeStr } from "../../utils/normalizers.js";
import { BudgeterError } from "../../lib/middleware/error.js";
import { generateOneTimeCode, getExpirationLength } from "../../lib/security/oneTimeCode.js";
import { oneTimeCodesService } from "../../services/mongodb/index.js";
import { sendOneTimeCodeVerification } from "../../lib/verification/index.js";

const validate = (req) => {
   let email = null;
   let phoneNumber = null;
   let type = null;
   if(!req.body || (!req.body.userIdentifier)) {
      req.logger.error("No user identifier found");
      throw new BudgeterError(400, "userIdentifier is required"); 
   }

   const userIdentifier = req.body.userIdentifier.toString();
   if(userIdentifier.includes("@")) {
      if(!isEmail(userIdentifier)) {
         req.logger.error(`Invalid email = ${userIdentifier}`);
         throw new BudgeterError(400, "Email is not valid");
      }
      email = normalizeStr(userIdentifier);
      type = "email";
      req.logger.info(`Email provided = ${email}`);
   }
   else {
      if(!isPhoneNumber(userIdentifier)) {
         req.logger.error(`Invalid phone number = ${userIdentifier}`);
         throw new BudgeterError(400, "Phone number is not valid");
      }
      phoneNumber = normalizePhoneNumber(userIdentifier);
      type = "phone";
      req.logger.info(`Phone number provided = ${phoneNumber}`);
   }

   return { email, phoneNumber, type };
};

const createCode = async (req, input) => {
   const userIdentifier = input.type === "phone" ? input.phoneNumber : input.email;
   const oneTimeCode = generateOneTimeCode(req, userIdentifier);
   const oneTimeCodeService = await oneTimeCodesService(req);
   return await oneTimeCodeService.create(oneTimeCode);
};

const challenge = async (req, res, next) => {
   const input = validate(req);
   const oneTimeCode = await createCode(req, input);
   await sendOneTimeCodeVerification(req, { 
      ...input,
      code: oneTimeCode.code
   });
   res.json({
      type: input.type,
      expires: getExpirationLength(),
      key: oneTimeCode.key
   });
};

export default challenge;