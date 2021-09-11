import { APIGatewayProxyResult } from "aws-lambda";
import { BudgeterError, ValidationError } from "models/errors";

const transformErrorToResponse = (error: Error) =>
   JSON.stringify({ message: error.message, stack: error.stack });

export const handleErrorResponse = async (
   error: Error
): Promise<APIGatewayProxyResult> => {
   let statusCode: number;
   let body: string;
   if(error instanceof ValidationError) {
      statusCode = error.statusCode;
      body = JSON.stringify({ message: error.message, validationErrors: error.validationErrors });
   }
   else if (error instanceof BudgeterError) {
      statusCode = error.statusCode;
      body = transformErrorToResponse(error);
   } else {
      console.log("500 error received");
      console.log(error);
      statusCode = 500;
      body = transformErrorToResponse(error);
   }

   return { statusCode, body };
};
