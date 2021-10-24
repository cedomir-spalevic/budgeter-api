import challenge from "../controllers/auth/challenge/index.js";
import confirmation from "../controllers/auth/confirmation/index.js";
import refresh from "../controllers/auth/refresh/index.js";
import { asyncHandler } from "../lib/middleware/error.js";
import * as constants from "../utils/constants.js";

export const setupRoutes = (app) => {
   app.post(constants.CHALLENGE_PATH, asyncHandler(challenge));
   app.post(constants.CONFIRM_PATH, asyncHandler(confirmation));
   app.post(constants.REFRESH_PATH, asyncHandler(refresh));
};