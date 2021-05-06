import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { processUpdateUser } from "./processor";
import { validateForm, validatePathParameter } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const userId = validatePathParameter(event.pathParameters);
      const form = validateJSONBody(event.body);
      const userRequest = await validateForm(form);
      const response = await processUpdateUser(userId, userRequest);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
