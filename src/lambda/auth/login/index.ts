import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { processLogin } from "./processor";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidEmail, isValidJSONBody } from "middleware/validators";
import { GeneralError } from "models/errors";
import { parsePhoneNumber } from "services/external/phoneNumber";

export interface LoginBody {
   email?: string;
   phoneNumber?: string;
   password: string;
}

const validate = (event: APIGatewayProxyEvent): LoginBody => {
   const form = isValidJSONBody(event.body);
   let email = isStr(form, "email");
   let phoneNumber = isStr(form, "phoneNumber");
   const password = isStr(form, "password", true);

   if (email === undefined && phoneNumber === undefined)
      throw new GeneralError("An email or phone number must be provided");
   if (email) {
      if (email === null || email.trim().length === 0)
         throw new GeneralError("Email cannot be blank");
      if (!isValidEmail(email)) throw new GeneralError("Email is not valid");
      email = email.toLowerCase().trim();
   }
   if (phoneNumber) {
      if (phoneNumber === null || phoneNumber.trim().length === 0)
         throw new GeneralError("Phone number cannot be blank");
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (!parsedPhoneNumber.isValid)
         throw new GeneralError("Phone number is not valid");
      phoneNumber = parsedPhoneNumber.internationalFormat;
   }
   if (!email) email = null;
   if (!phoneNumber) phoneNumber = null;

   return { email, phoneNumber, password };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const loginBody = validate(event);
      const response = await processLogin(loginBody);
      return {
         statusCode: response.status,
         body: JSON.stringify(response.response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
