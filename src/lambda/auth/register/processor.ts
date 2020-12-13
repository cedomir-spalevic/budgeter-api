import { UserClaims } from "models/auth";
import { User } from "models/data";
import { AlreadyExistsError, GeneralError } from "models/errors";
import { AuthResponse } from "models/responses";
import { WithId } from "mongodb";
import UserAuthService from "services/external/mongodb/userAuth";
import UsersService from "services/external/mongodb/users";
import { generateToken } from "services/internal/security";

export const processRegister = async (email: string, password: string, claims: UserClaims[]): Promise<AuthResponse> => {
   // Check if email and password are valid
   if (!email)
      throw new GeneralError("Email cannot be blank");
   if (!password)
      throw new GeneralError("Password cannot be blank");

   // Set email to all lowercase
   email = email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const usersAuthService = await UserAuthService.getInstance();

   // Check if a user already exists with this email
   const existingUser = await usersService.findUserByEmail(email);
   if (existingUser)
      throw new AlreadyExistsError();

   // Create a new user
   let user: WithId<User> = await usersService.create(email, claims);

   // Create user auth
   try {
      await usersAuthService.create(user._id, password);
   }
   catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(user._id);
      throw error;
   }

   // Lastly, generate token for new user
   const token = generateToken(user._id);

   // If all goes well, we'll be here
   return {
      token,
      user
   }
}