import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { User } from "models/data";
import { AuthResponse } from "models/responses";
import { generateToken } from "services/security";
import UsersService from "services/db/users";
import UsersAuthService from "services/db/userAuth";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const requestFormBody = JSON.parse(event.body);
   let email: string = requestFormBody["email"];
   const password = requestFormBody["password"];

   // Check if email and password exist in the request
   if (!email || !password) {
      return {
         statusCode: 400,
         body: "Email and password must be sent in the body"
      };
   }

   // Set email to all lowercase
   email = email.toLowerCase();

   let user: User;
   const authResponse: AuthResponse = {
      valid: false
   }

   // Create a new user
   try {
      const usersService = new UsersService();
      user = await usersService.create(email);
   }
   catch (error) {
      authResponse.emailError = "A user already exists with this email, dumbass";
      return {
         statusCode: 400,
         body: JSON.stringify(authResponse)
      };
   }

   // Next create auth hash
   try {
      const usersAuthService = new UsersAuthService();
      const userExists = await usersAuthService.create(user.userId, password);
      if (!userExists)
         throw new Error();
   }
   catch (error) {
      authResponse.emailError = "A user already exists with this email";
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
      authResponse.totalError = "Unable to sign up";
      return {
         statusCode: 400,
         body: JSON.stringify(authResponse)
      };
   }
}