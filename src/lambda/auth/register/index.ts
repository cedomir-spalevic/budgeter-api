import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { UserClaims } from "models/auth";
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
      return handleErrorResponse(error);
   }
}