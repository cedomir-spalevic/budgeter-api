import challenge from "../controllers/auth/challenge/index.js";
import confirmation from "../controllers/auth/confirmation/index.js";
import refresh from "../controllers/auth/refresh.js";
import { asyncHandler } from "../lib/middleware/error.js";

export const setupRoutes = (app) => {
   app.post("/auth/challenge", asyncHandler(challenge));
   app.post("/auth/confirm", asyncHandler(confirmation));
   app.post("/auth/refresh", asyncHandler(refresh));
};