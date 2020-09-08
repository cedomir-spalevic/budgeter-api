import { User } from "models/data";
import { AuthResponse } from "models/responses";
import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { generateToken } from "services/security";
import UsersService from "services/db/users";
import UsersAuthService from "services/db/userAuth";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const requestFormBody = JSON.parse(event.body);
   const email = requestFormBody["email"];
   const password = requestFormBody["password"];

   // Check if email and password exist in the request
   if (!email || !password) {
      return {
         statusCode: 400,
         body: "Email and password must be sent in the body"
      };
   }

   let user: User;
   const authResponse: AuthResponse = {
      valid: false
   }

   // Check if user exists with email
   try {
      const usersService = new UsersService();
      user = await usersService.findUserByEmail(email);
   }
   catch (error) {
      authResponse.emailError = "No user found with this email";
      return {
         statusCode: 400,
         body: JSON.stringify(authResponse)
      };
   }

   // Next scan the users password
   try {
      const usersAuthService = new UsersAuthService();
      const userExists = await usersAuthService.find(user.userId, password);
      if (!userExists)
         throw new Error();
   }
   catch (error) {
      authResponse.passwordError = "Invalid password";
      return {
         statusCode: 400,
         body: JSON.stringify(authResponse)
      };
   }

   // Finally, generate JWT token
   try {
      const token = generateToken(user.userId);
      authResponse.token = token;
      authResponse.valid = true;
      return {
         statusCode: 200,
         body: JSON.stringify(authResponse)
      }
   }
   catch (error) {
      authResponse.totalError = "Unable to sign in";
      return {
         statusCode: 400,
         body: JSON.stringify(authResponse)
      };
   }
}