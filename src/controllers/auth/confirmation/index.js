import { BudgeterError } from "../../../lib/middleware/error.js";
import { generateUserAuth } from "../../../lib/security/userAuth.js";
import { isGuid } from "../../../lib/security/guid.js";
import { isOneTimeCode } from "../../../lib/security/oneTimeCode.js";
import { getOneTimeCodesCollection, getUsersCollection } from "../../../services/mongodb/index.js";
import { EMAIL_USER_IDENTIFIER_TYPE, PHONE_USER_IDENTIFIER_TYPE } from "../../../utils/constants.js";

const validate = (req) => {
   let key = null;
   let code = null;
   if(!req.body || req.body.key === undefined) {
      req.logger.error("No key found");
      throw new BudgeterError(400, "key is required"); 
   }

   if(!req.body || req.body.code === undefined) {
      req.logger.error("No code found");
      throw new BudgeterError(400, "code is required"); 
   }

   key = req.body.key?.toString().trim();
   if(!isGuid(key)) {
      req.logger.error(`Invalid key = ${key}`);
      throw new BudgeterError(400, "key is not valid");
   }
   req.logger.info(`Key provided = ${key}`);

   code = req.body.code?.toString().trim();
   if(!isOneTimeCode(code)) {
      req.logger.error(`Invalid code = ${code}`);
      throw new BudgeterError(400, "code is not valid");
   }
   req.logger.info(`Code provided = ${code}`);

   return { key, code };
};

const findOneTimeCode  = async (req, input) => {
   const oneTimeCodesCollection = await getOneTimeCodesCollection(req);
   const oneTimeCode = await oneTimeCodesCollection.find({
      key: input.key,
      code: input.code
   });
   if(!oneTimeCode || oneTimeCode.expiresOn < Date.now()) {
      throw new BudgeterError(401, "Unauthorized");
   }
   return oneTimeCode;
};

const getUser = async (req, oneTimeCode) => {
   const usersCollection = await getUsersCollection(req);
   let user = await usersCollection.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: oneTimeCode.userIdentifier }]
         },
         {
            $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: oneTimeCode.userIdentifier }]
         }
      ]
   });
   if(!user) {
      user = {
         email:  oneTimeCode.userIdentifierType === EMAIL_USER_IDENTIFIER_TYPE ? oneTimeCode.userIdentifier : null,
         phoneNumber: oneTimeCode.userIdentifierType === PHONE_USER_IDENTIFIER_TYPE ? oneTimeCode.userIdentifier : null
      };
      user = await usersCollection.create(user);
   }
   else {
      if(user.email === null && oneTimeCode.userIdentifierType === EMAIL_USER_IDENTIFIER_TYPE) {
         user.email = oneTimeCode.userIdentifier;
         await usersCollection.update(user);
      }
      if(user.phoneNumber === null && oneTimeCode.userIdentifierType === PHONE_USER_IDENTIFIER_TYPE) {
         user.phoneNumber = oneTimeCode.userIdentifier;
         await usersCollection.update(user);
      }
   }
   return user;
};

const confirmation = async (req, res, next) => {
   const input = validate(req);
   const oneTimeCode = await findOneTimeCode(req, input);
   const user = await getUser(req, oneTimeCode);
   const userAuth = await generateUserAuth(req, user._id);
   res.json({ ...userAuth });
};

export default confirmation;