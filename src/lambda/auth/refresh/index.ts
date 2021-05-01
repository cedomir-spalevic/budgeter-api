import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { processRefresh } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const form = validateJSONBody(event.body);
      const refreshBody = validate(form);
      const response = await processRefresh(refreshBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
