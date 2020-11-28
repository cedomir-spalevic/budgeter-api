import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import UsersService from "services/db/users";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   let userId: string;
   try {
      userId = await isAdminAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   try {
      const usersService = new UsersService();
      const users = await usersService.getAllUsers();
      return {
         statusCode: 200,
         body: JSON.stringify(users)
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to get users"
      };
   }
}