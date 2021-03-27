import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isOneOfStr, isStr, isValidJSONBody } from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { processChallenge } from "./processor";

export interface ChallengeBody {
   email: string;
   type: OneTimeCodeType;
}

const validator = (event: APIGatewayProxyEvent): ChallengeBody => {
   const form = isValidJSONBody(event.body);
   const type = isOneOfStr(
      form,
      "type",
      ["emailVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   const email = isStr(form, "email", true);

   return { email, type };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const challengeBody = validator(event);
      const response = await processChallenge(challengeBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
