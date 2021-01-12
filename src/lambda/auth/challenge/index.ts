import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";
import { processChallenge } from "./processor";

export interface ChallengeBody {
   email: string;
}

const validator = (event: APIGatewayProxyEvent): ChallengeBody => {
   const form = isValidJSONBody(event.body);
   const email = isStr(form, "email", true);

   return { email }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const challengeBody = validator(event);
      const response = await processChallenge(challengeBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}