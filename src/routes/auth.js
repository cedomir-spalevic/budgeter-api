import challenge from "../controllers/auth/challenge.js";
import confirmation from "../controllers/auth/confirmation.js";
import refresh from "../controllers/auth/refresh.js";
import asyncHandler from "../utils/asyncHandler.js";

export const setupRoutes = (app) => {
   app.get("/", (req, res) => {
      res.send("Hello, Cedomir!");
   });
   app.post("/auth/challenge", asyncHandler(challenge));
   app.post("/auth/confirmation", confirmation);
   app.post("/auth/refresh", refresh);
};
