const { BudgeterError } = require("lib/middleware/error");
const { generateUserAuth } = require("lib/security/userAuth");
const { getRefreshTokensCollection } = require("services/mongodb");

const validate = (req) => {
   let refreshToken = null;
   if(!req.body || req.body.refreshToken === undefined) {
      req.logger.error("No refreshToken found");
      throw new BudgeterError(400, "refreshToken is required"); 
   }

   refreshToken = req.body.refreshToken?.toString().trim();
   // Todo: Refresh token validation
   if(!refreshToken) {
      req.logger.error(`Invalid refreshToken = ${refreshToken}`);
      throw new BudgeterError(400, "refreshToken is not valid");
   }
   req.logger.info(`refreshToken provided = ${refreshToken}`);

   return refreshToken;
};

const findRefreshToken = async (req, token) => {
   const refreshTokenCollection = await getRefreshTokensCollection(req);
   const refreshToken = await refreshTokenCollection.find({ token });
   if(!refreshToken || refreshToken.expires < Date.now()) {
      throw new BudgeterError(401, "Unauthorized");
   }
   return refreshToken;
};

const refresh = async (req, res, next) => {
   const tokenInput = validate(req);
   const refreshToken = await findRefreshToken(req, tokenInput);
   const userAuth = await generateUserAuth(req, refreshToken.userId);
   res.json({ ...userAuth });
};

module.exports = refresh;