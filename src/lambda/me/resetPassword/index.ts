import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameterId } from "middleware/url";
import { isStr, isValidJSONBody } from "middleware/validators";
import { processPasswordReset } from "./processor";

export interface PasswordResetBody {
   key: string;
   password: string;
}

const validator = (event: APIGatewayProxyEvent): PasswordResetBody => {
   const key = getPathParameterId("key", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const password = isStr(form, "password", true);

   return { key, password }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const registerBody = validator(event);
      const response = await processPasswordReset(registerBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*"
         }
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}