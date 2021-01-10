import { GeneralError, NoUserEmailFoundError, UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import UserAuthService from "services/external/mongodb/userAuth";
import UsersService from "services/external/mongodb/users";
import { generateToken } from "services/internal/security";
import { LoginBody } from ".";

export const processSignIn = async (loginBody: LoginBody): Promise<AuthResponse> => {
   // Check if email and password are in the request
   if (!loginBody.email)
      throw new GeneralError("Email cannot be blank");
   if (!loginBody.password)
      throw new GeneralError("Password cannot be blank");

   // Set email to all lowercase
   const email = loginBody.email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const usersAuthService = await UserAuthService.getInstance();

   // Look for a user with this email address
   const user = await usersService.findUserByEmail(email);
   if (!user)
      throw new NoUserEmailFoundError();

   // Next scan the users password
   const exists = await usersAuthService.exists(user._id, loginBody.password);
   if (!exists)
      throw new UnauthorizedError();

   // Lastly, generate token for new user
   const token = generateToken(user._id);

   // If all goes well, return the access token and the user
   return { token }
}