import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { isBool, isStr, isValidJSONBody } from "middleware/validators";
import { GeneralError } from "models/errors";
import { AdminUserRequest } from "models/requests";
import { parsePhoneNumber } from "services/external/phoneNumber";
import { processCreateUser } from "./processor";

const validate = async (
   event: APIGatewayProxyEvent
): Promise<AdminUserRequest> => {
   await isAdminAuthorized(event);
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   let email = isStr(form, "email");
   let phoneNumber = isStr(form, "phoneNumber");
   const isAdmin = isBool(form, "isAdmin", true);
   const password = isStr(form, "password", true);

   if (email === undefined && phoneNumber === undefined)
      throw new GeneralError("An email or phone number must be provided");
   if (email) {
      if (email === null || email.trim().length === 0)
         throw new GeneralError("Email cannot be blank");
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

   if (!password) throw new GeneralError("Password cannot be blank");

   return {
      firstName,
      lastName,
      email,
      phoneNumber,
      isAdmin,
      password
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userBody = await validate(event);
      const response = await processCreateUser(userBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
