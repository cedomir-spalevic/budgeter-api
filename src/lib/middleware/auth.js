const constants = require("utils/constants");
const { BudgeterError } = require("./error");
const { decodeAccessToken } = require("../security/accessToken");

const prodBlocklistedRoutes = [
   {
      path: constants.CHALLENGE_PATH,
      method: constants.HTTP_METHODS.POST
   },
   {
      path: constants.CONFIRM_PATH,
      method: constants.HTTP_METHODS.POST
   },
   {
      path: constants.REFRESH_PATH,
      method: constants.HTTP_METHODS.POST
   }
];

const localBlocklistedRoutes = [
   ...prodBlocklistedRoutes,
   {
      path: constants.GRAPHQL_PATH,
      method: constants.HTTP_METHODS.GET
   },
   {
      path: constants.GRAPHQL_PATH,
      method: constants.HTTP_METHODS.OPTIONS
   }
];

module.exports.verifyAuthenticatedRequest = (req, res, next) => {
   const blocklistedRoutes = process.env.LOCAL
      ? localBlocklistedRoutes
      : prodBlocklistedRoutes;
   if (
      blocklistedRoutes.some(
         (route) =>
            route.path === req.originalUrl && route.method === req.method
      )
   ) {
      next();
      return;
   }
   let token = req.headers["authorization"];
   if (!token) {
      next(new BudgeterError(401, "Unauthorized"));
      return;
   }
   token = token.replace("Bearer ", "");
   const payload = decodeAccessToken(token);
   req.user = {
      id: payload.userId
   };
   next();
};
