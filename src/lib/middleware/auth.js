const blocklistedRoutes = [];

export const verifyAuthenticatedRequest = (req, res, next) => {
   // TODO:
   // If not blocklisted route - next()
   // If blocklisted route - 
   //    Check if authenticated
   //       If not, return 401
   next();
};