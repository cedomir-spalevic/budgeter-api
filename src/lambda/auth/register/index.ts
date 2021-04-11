import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody, isValidPhoneNumber } from "middleware/validators";
import { GeneralError } from "models/errors";
import { processRegister } from "./processor";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

const validate = (event: APIGatewayProxyEvent): RegisterBody => {
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   const email = isStr(form, "email");
   const phoneNumber = isStr(form, "phoneNumber");
   const password = isStr(form, "password", true);

   if (!email && !phoneNumber)
      throw new GeneralError("An email or phone number must be provided");
   if (email !== undefined && email.trim().length === 0)
      throw new GeneralError("Email cannot be blank");
   if (phoneNumber !== undefined && !isValidPhoneNumber(phoneNumber))
      throw new GeneralError("Phone number must be valid");

   return {
      firstName,
      lastName,
      email: email !== undefined ? email.toLowerCase().trim() : undefined,
      phoneNumber,
      password
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const registerBody = validate(event);
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
