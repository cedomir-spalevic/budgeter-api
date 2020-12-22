import {
   BudgeterError
} from "models/errors";

const transformErrorToResponse = (error: Error) => JSON.stringify({ message: error.message, stack: error.stack })

export const handleErrorResponse = (error: Error) => {
   let statusCode: number;
   let body: string;
   if (error instanceof BudgeterError) {
      statusCode = error.statusCode;
      body = transformErrorToResponse(error);
   }
   else {
      statusCode = 500;
      body = transformErrorToResponse(error);
   }

   return { statusCode, body };
}