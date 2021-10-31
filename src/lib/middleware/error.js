class BudgeterError extends Error {
   constructor(statusCode, message, error) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.originalError = error;
   }

   format = () => ({ message: this.message });
}

const budgeterErrorHandler = (err, req, res, next) => {
   if(err instanceof BudgeterError) {
      req.logger.error(`Custom error thrown: Status code = ${err.statusCode}, Message = ${err.message}`);
      if(err.originalError) {
         req.logger.error("Original error provided:");
         req.logger.error(err.originalError);
      }
      res.status(err.statusCode).send(err.format());
   }
   else {
      req.logger.error(`Unknown error thrown: Message = ${err.message}`);
      req.logger.error("Error:");
      req.logger.error(err);
      res.status(500).send({ message: "Something went wrong. Hopefully I got alerted so I can fix it. If not, you'll have to wait until then. :/"});
   }
};

const asyncHandler = (fn) => {
   return async (req, res, next) => {
      try {
         await fn(req, res, next);
      }
      catch(error) {
         next(error);
      }
   };
};

module.exports = {
   asyncHandler,
   budgeterErrorHandler,
   BudgeterError
};