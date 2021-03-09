import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";
import { processRegister } from "./processor";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

const validator = (event: APIGatewayProxyEvent): RegisterBody => {
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   const email = isStr(form, "email", true);
   const password = isStr(form, "password", true);

   return { firstName, lastName, email, password };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const registerBody = validator(event);
      const response = await processRegister(registerBody);
      return {
         statusCode: 201,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
