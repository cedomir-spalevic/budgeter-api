export class BudgeterError extends Error {
   constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
   }

   format = () => ({ message: this.message });
}

export const budgeterErrorHandler = (err, req, res, next) => {
   if(err instanceof BudgeterError) {
      req.logger.error("Custom error thrown");
      req.logger.error(err);
      res.status(err.statusCode).send(err.format());
   }
   else {
      req.logger.error("Unknown error thrown");
      req.logger.error(err);
      res.status(500).send({ message: "Something went wrong. :/"});
   }
};

export const asyncHandler = (fn) => {
   return async (req, res, next) => {
      try {
         await fn(req, res, next);
      }
      catch(error) {
         next(error);
      }
   };
};