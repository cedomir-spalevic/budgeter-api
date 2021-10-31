const challenge = require("controllers/auth/challenge");
const confirmation = require("controllers/auth/confirmation");
const refresh = require("controllers/auth/refresh");
const { asyncHandler } = require("lib/middleware/error");
const constants = require("utils/constants");

const setupRoutes = (app) => {
   app.post(constants.CHALLENGE_PATH, asyncHandler(challenge));
   app.post(constants.CONFIRM_PATH, asyncHandler(confirmation));
   app.post(constants.REFRESH_PATH, asyncHandler(refresh));
};

module.exports = {
   setupAuthRoutes: setupRoutes
};