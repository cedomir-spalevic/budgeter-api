import {
   AlreadyExistsError,
   GeneralError,
   NoBudgetFoundError,
   NoUserFoundError,
   UnauthorizedError
} from "models/errors";

const transformErrorToResponse = (error: Error) => JSON.stringify({ message: error.message, stack: error.stack })

export const handleErrorResponse = (error: Error) => {
   let statusCode: number;
   let body: string;
   if (error instanceof GeneralError) {
      statusCode = 400;
      body = transformErrorToResponse(error);
   }
   else if (error instanceof UnauthorizedError) {
      statusCode = 401;
      body = transformErrorToResponse(error);
   }
   else if (error instanceof NoBudgetFoundError) {
      statusCode = 404;
      body = transformErrorToResponse(error);
   }
   else if (error instanceof NoUserFoundError) {
      statusCode = 404;
      body = transformErrorToResponse(error);
   }
   else if (error instanceof AlreadyExistsError) {
      statusCode = 409;
      body = transformErrorToResponse(error);
   }
   else {
      statusCode = 500;
      body = transformErrorToResponse(error);
   }

   return { statusCode, body };
}