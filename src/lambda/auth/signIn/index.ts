import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { processSignIn } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const form = isValidJSONBody(event.body);
      const email = isStr(form, "email", true);
      const password = isStr(form, "password", true);

      const response = await processSignIn(email, password);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}