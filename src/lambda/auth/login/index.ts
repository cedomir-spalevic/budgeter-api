import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { processLogin } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { isValidJSONBody } from "middleware/validators";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const form = isValidJSONBody(event.body);
      const loginBody = validate(form);
      const response = await processLogin(loginBody);
      return {
         statusCode: response.status,
         body: JSON.stringify(response.response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
