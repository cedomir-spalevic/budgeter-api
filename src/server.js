import express from "express";
import { setupRoutes as setupAuthRoutes } from "./routes/auth.js";
import { setupRoutes as setupApolloServer } from "./routes/apolloServer.js";
import bodyParser from "body-parser";
import { budgeterErrorHandler } from "./lib/middleware/error.js";
import * as setup from "./setup.js";
import { getLogger } from "./lib/middleware/logger.js";

setup.loadConfigs();

const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", true);

const startServer = async () => {
   const { logger, loggingMiddleware } = await getLogger();
   
   app.use(loggingMiddleware);
   app.use(bodyParser.json());
   
   setupAuthRoutes(app);
   setupApolloServer(app);
   
   app.use(budgeterErrorHandler);
   
   if(process.env.LOCAL) {
      app.listen(port, () => {
         logger.info(`Server listening on port ${port}`);
      });
   }
   else {
      app.listen(port, "0.0.0.0", () => {
         logger.info("Server started! 🚀");
      });
   }
};

startServer();

export default app;