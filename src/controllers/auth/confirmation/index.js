const { BudgeterError } = require("lib/middleware/error");
const { generateUserAuth } = require("lib/security/userAuth");
const { isOneTimeCode } = require("lib/security/oneTimeCode");
const {
   getOneTimeCodesCollection,
   getUsersCollection,
   getPreferencesCollection
} = require("services/mongodb");
const {
   EMAIL_USER_IDENTIFIER_TYPE,
   PHONE_USER_IDENTIFIER_TYPE
} = require("utils/constants");

const validate = (req) => {
   let key = null;
   let code = null;
   if (!req.body || req.body.key === undefined) {
      req.logger.error("No key found");
      throw new BudgeterError(400, "key is required");
   }

   if (!req.body || req.body.code === undefined) {
      req.logger.error("No code found");
      throw new BudgeterError(400, "code is required");
   }

   key = req.body.key?.toString().trim();
   if (!key) {
      req.logger.error(`Invalid key = ${key}`);
      throw new BudgeterError(400, "key is not valid");
   }
   req.logger.info(`Key provided = ${key}`);

   code = req.body.code?.toString().trim();
   if (!isOneTimeCode(code)) {
      req.logger.error(`Invalid code = ${code}`);
      throw new BudgeterError(400, "code is not valid");
   }
   req.logger.info(`Code provided = ${code}`);

   return { key, code };
};

const findOneTimeCode = async (req, input) => {
   const oneTimeCodesCollection = await getOneTimeCodesCollection(req);
   const oneTimeCode = await oneTimeCodesCollection.find({
      key: input.key,
      code: input.code
   });
   if (!oneTimeCode || oneTimeCode.expires < Date.now()) {
      throw new BudgeterError(401, "Unauthorized");
   }
   return oneTimeCode;
};

const getUser = async (req, oneTimeCode) => {
   const usersCollection = await getUsersCollection(req);
   let user = await usersCollection.find({
      $or: [
         {
            $and: [
               { email: { $ne: null } },
               { email: oneTimeCode.userIdentifier }
            ]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: oneTimeCode.userIdentifier }
            ]
         }
      ]
   });
   if (!user) {
      user = {
         email:
            oneTimeCode.userIdentifierType === EMAIL_USER_IDENTIFIER_TYPE
               ? oneTimeCode.userIdentifier
               : null,
         phoneNumber:
            oneTimeCode.userIdentifierType === PHONE_USER_IDENTIFIER_TYPE
               ? oneTimeCode.userIdentifier
               : null
      };
      user = await usersCollection.create(user);
      const preferences = {
         userId: user.id,
         incomeNotifications: false,
         paymentNotifications: false
      };
      const preferencesCollection = await getPreferencesCollection(req);
      await preferencesCollection.create(preferences);
   } else {
      if (
         user.email === null &&
         oneTimeCode.userIdentifierType === EMAIL_USER_IDENTIFIER_TYPE
      ) {
         user.email = oneTimeCode.userIdentifier;
         await usersCollection.update(user);
      }
      if (
         user.phoneNumber === null &&
         oneTimeCode.userIdentifierType === PHONE_USER_IDENTIFIER_TYPE
      ) {
         user.phoneNumber = oneTimeCode.userIdentifier;
         await usersCollection.update(user);
      }
   }
   return user;
};

const confirmation = async (req, res) => {
   const input = validate(req);
   const oneTimeCode = await findOneTimeCode(req, input);
   const user = await getUser(req, oneTimeCode);
   const userAuth = await generateUserAuth(req, user.id);
   res.json({ ...userAuth });
};

module.exports = confirmation;
