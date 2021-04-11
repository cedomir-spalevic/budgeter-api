import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import {
   isOneOfStr,
   isStr,
   isValidJSONBody,
   isValidPhoneNumber
} from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { GeneralError } from "models/errors";
import { processChallenge } from "./processor";

export interface ChallengeBody {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}

const validate = (event: APIGatewayProxyEvent): ChallengeBody => {
   const form = isValidJSONBody(event.body);
   const type = isOneOfStr(
      form,
      "type",
      ["emailVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   const email = isStr(form, "email", false);
   const phoneNumber = isStr(form, "phoneNumber", false);

   if (!email && !phoneNumber)
      throw new GeneralError("An email or phone number must be provided");
   if (email !== undefined && email.trim().length === 0)
      throw new GeneralError("Email cannot be blank");
   if (phoneNumber !== undefined && !isValidPhoneNumber(phoneNumber))
      throw new GeneralError("Phone number must be valid");

   return {
      email: email !== undefined ? email.toLowerCase().trim() : undefined,
      phoneNumber,
      type
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const challengeBody = validate(event);
      const response = await processChallenge(challengeBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
