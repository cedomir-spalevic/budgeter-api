const lb = require("@google-cloud/logging-bunyan");

module.exports.getLogger = async () => {
   let logger, loggingMiddleware;
   if(process.env.LOCAL) {
      logger = {
         warn: (log) => console.warn(log),
         info: (log) => console.info(log),
         error: (log) => console.error(log)
      };
      loggingMiddleware = (req, res, next) => {
         req.logger = logger;
         next();
      };
   }
   else {
      const bunyanLogger = await lb.express.middleware({
         logName: "budgeter"
      });
      logger = bunyanLogger.logger;
      loggingMiddleware = bunyanLogger.mw;
   }
   return { logger, loggingMiddleware };
};