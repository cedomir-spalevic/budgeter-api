import { String } from "aws-sdk/clients/acm";
import { GeneralError, NoUserFoundError, UnauthorizedError } from "models/errors";
import UserAuthService from "services/external/mongodb/userAuth";
import UsersService from "services/external/mongodb/users";
import { generateToken } from "services/internal/security";

export const processSignIn = async (email: string, password: string) => {
   // Check if email and password are in the request
   if (!email)
      throw new GeneralError("Email cannot be blank");
   if (!password)
      throw new GeneralError("Password cannot be blank");

   // Set email to all lowercase
   email = email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const usersAuthService = await UserAuthService.getInstance();

   // Look for a user with this email address
   const user = await usersService.findUserByEmail(email);
   if (!user)
      throw new NoUserFoundError();

   // Next scan the users password
   const exists = await usersAuthService.exists(user._id, password);
   if (!exists)
      throw new UnauthorizedError();

   // Lastly, generate token for new user
   const token = generateToken(user._id);

   // If all goes well, return the access token and the user
   return {
      token,
      user
   }
}