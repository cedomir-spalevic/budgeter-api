import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameterId } from "middleware/url";
import { validateJSONBody } from "middleware/validators";
import { processChallengeConfirmation } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const key = getPathParameterId("key", event.pathParameters);
      const form = validateJSONBody(event.body);
      const challengeConfirmationBody = validate(key, form);
      const response = await processChallengeConfirmation(
         challengeConfirmationBody
      );
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
