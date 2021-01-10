import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";
import { UserClaims } from "models/auth";
import { processRegister } from "./processor";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   userClaims: UserClaims[];
}

const validator = (event: APIGatewayProxyEvent): RegisterBody => {
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   const email = isStr(form, "email", true);
   const password = isStr(form, "password", true);
   const claims = isStr(form, "claims");
   const userClaims: UserClaims[] = [];
   if (claims) {
      const list = claims.split(",");
      if (list.includes("service"))
         userClaims.push(UserClaims.Service);
      if (list.includes("admin"))
         userClaims.push(UserClaims.Admin);
   }

   return { firstName, lastName, email, password, userClaims }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const registerBody = validator(event);
      const response = await processRegister(registerBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}