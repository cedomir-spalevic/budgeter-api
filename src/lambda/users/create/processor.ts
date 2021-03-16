import { AdminPublicUser, User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { AlreadyExistsError, GeneralError } from "models/errors";
import { AdminUserRequest } from "models/requests";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";

export const processCreateUser = async (
   userRequest: AdminUserRequest
): Promise<AdminPublicUser> => {
   if (!userRequest.email) throw new GeneralError("Email cannot be blank");
   if (!userRequest.password)
      throw new GeneralError("Password cannot be blank");

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();
   const email = userRequest.email.toLowerCase();

   // Check if a user already exists with this email
   const existingUser = await usersService.find({ email });
   if (existingUser) throw new AlreadyExistsError();

   // Create a new user
   const newUser: Partial<User> = {
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: email,
      isAdmin: userRequest.isAdmin,
      isEmailVerified: false,
      notificationPreferences: {
         incomeNotifications: false,
         paymentNotifications: false,
      },
   };
   const user = await usersService.create(newUser);

   // Create user auth
   try {
      const userAuth: Partial<UserAuth> = {
         userId: user._id,
         hash: generateHash(userRequest.password),
      };
      await usersAuthService.create(userAuth);
   } catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(user._id);
      throw error;
   }

   return {
      id: user._id.toHexString(),
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.isEmailVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn,
   };
};
