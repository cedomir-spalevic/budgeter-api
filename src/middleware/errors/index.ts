import { APIGatewayProxyResult } from "aws-lambda";
import { BudgeterError, ValidationError } from "models/errors";
import { logError } from "services/internal/logging";

const transformErrorToResponse = (error: Error) =>
   JSON.stringify({ message: error.message, stack: error.stack });

export const handleErrorResponse = async (
   error: Error
): Promise<APIGatewayProxyResult> => {
   logError("Error caught:");
   logError(error);
   let statusCode: number;
   let body: string;
   if (error instanceof ValidationError) {
      statusCode = error.statusCode;
      body = JSON.stringify({
         message: error.message,
         validationErrors: error.validationErrors
      });
   } else if (error instanceof BudgeterError) {
      statusCode = error.statusCode;
      body = transformErrorToResponse(error);
   } else {
      logError("Throwing 500 error");
      statusCode = 500;
      body = transformErrorToResponse(error);
   }

   return { statusCode, body };
};
