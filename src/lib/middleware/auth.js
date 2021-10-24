import * as constants from "../../utils/constants.js";
import { BudgeterError } from "./error.js";
import { decodeAccessToken } from "../security/accessToken.js";

const blocklistedRoutes = [
   constants.CHALLENGE_PATH,
   constants.CONFIRM_PATH,
   constants.REFRESH_PATH
];

export const verifyAuthenticatedRequest = (req, res, next) => {
   if(blocklistedRoutes.includes(req.originalUrl))
      next();
   let token = req.headers["authorization"];
   if(!token) 
      throw new BudgeterError(401, "Unauthorized");
   token = token.replace("Bearer ", "");
   decodeAccessToken(token);
   next();
};