import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { UserClaims } from "models/auth";
import { AlreadyExistsError, GeneralError, transformErrorToResponse } from "models/errors";
import { processRegister } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const form = JSON.parse(event.body);
      const email = form["email"];
      const password = form["password"];
      const claims = form["claims"];
      const userClaims: UserClaims[] = [];
      if (claims) {
         const list = claims.split(",");
         if (list.includes("service"))
            userClaims.push(UserClaims.Service);
         if (list.includes("admin"))
            userClaims.push(UserClaims.Admin);
      }

      const response = await processRegister(email, password, userClaims);
      return {
         statusCode: 201,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      let statusCode: number;
      let body: string;
      if (error instanceof AlreadyExistsError) {
         error.message = "A user already exists with this email address";
         error.stack = undefined;
         statusCode = 409;
         body = transformErrorToResponse(error);
      }
      else if (error instanceof GeneralError) {
         statusCode = 400;
         body = transformErrorToResponse(error);
      }
      else {
         statusCode = 500;
         body = transformErrorToResponse(error);
      }

      return { statusCode, body };
   }
}