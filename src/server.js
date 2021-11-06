const express = require("express");
const { setupAuthRoutes } = require("routes/auth");
const { setupApolloServer } = require("routes/apolloServer");
const bodyParser = require("body-parser");
const { budgeterErrorHandler } = require("lib/middleware/error");
const { verifyAuthenticatedRequest } = require("lib/middleware/auth");
const { setupConfigs } = require("config");
const { getLogger } = require("lib/middleware/logger");

const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", true);

const startServer = async () => {
   await setupConfigs();

   const { logger, loggingMiddleware } = await getLogger();

   app.use(loggingMiddleware);
   app.use(verifyAuthenticatedRequest);
   app.use(bodyParser.json());

   setupAuthRoutes(app);
   setupApolloServer(app);

   app.use(budgeterErrorHandler);

   if (process.env.LOCAL) {
      app.listen(port, () => {
         logger.info(`Server listening on port ${port}`);
      });
   } else {
      app.listen(port, "0.0.0.0", () => {
         logger.info("Server started! 🚀");
      });
   }
};

startServer();

module.exports = app;
