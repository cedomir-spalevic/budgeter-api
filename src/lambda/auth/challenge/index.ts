import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import {
   isOneOfStr,
   isStr,
   isValidJSONBody
} from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { GeneralError } from "models/errors";
import { parsePhoneNumber } from "services/external/phoneNumber";
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
      ["mfaVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   let email = isStr(form, "email");
   let phoneNumber = isStr(form, "phoneNumber");
   
   if (email === undefined && phoneNumber === undefined)
      throw new GeneralError("An email or phone number must be provided");
   if(email) {
      if (email === null || email.trim().length === 0)
         throw new GeneralError("Email cannot be blank");
      email = email.toLowerCase().trim();
      phoneNumber = null;
   }
   if(phoneNumber) {
      if (phoneNumber === null || phoneNumber.trim().length === 0)
         throw new GeneralError("Phone number cannot be blank");
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (!parsedPhoneNumber.isValid)
         throw new GeneralError("Phone number is not valid");
      phoneNumber = parsedPhoneNumber.internationalFormat;
      email = null;
   }

   return {
      email,
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
