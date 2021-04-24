import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { processRegister } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const form = validateJSONBody(event.body);
      const registerBody = validate(form);
      const response = await processRegister(registerBody);
      return {
         statusCode: 201,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*"
         }
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
