import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { User } from "models/data";
import UsersService, { UserClaims } from "services/external/db/users";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   const userId = event.pathParameters["userId"];
   if (!userId) {
      return {
         statusCode: 400,
         body: "User Id is invalid"
      };
   }

   const requestFormBody = JSON.parse(event.body);
   const claims = requestFormBody["claims"] as string;

   try {
      const userClaims: UserClaims[] = [];
      const list = claims.split(",");
      if (list.includes("service"))
         userClaims.push(UserClaims.Service);
      if (list.includes("admin"))
         userClaims.push(UserClaims.Admin);
      const usersService = new UsersService();
      await usersService.update(userId, userClaims);
      return {
         statusCode: 201,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to update User"
      }
   }
}