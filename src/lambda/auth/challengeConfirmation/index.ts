import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameterId } from "middleware/url";
import { isNumber, isValidJSONBody } from "middleware/validators";
import { processChallengeConfirmation } from "./processor";

export interface ChallengeConfirmationBody {
   key: string;
   code: number;
}

const validate = (event: APIGatewayProxyEvent): ChallengeConfirmationBody => {
   const key = getPathParameterId("key", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const code = isNumber(form, "code", true);

   return { key, code };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const challengeConfirmationBody = validate(event);
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
