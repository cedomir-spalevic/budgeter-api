import { AdminPublicUser, User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { AlreadyExistsError } from "models/errors";
import { AdminUserRequest } from "models/requests";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";

export const processCreateUser = async (
   request: AdminUserRequest
): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();

   const existingUser = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: request.email }]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: request.phoneNumber }
            ]
         }
      ]
   });
   if (existingUser) throw new AlreadyExistsError();

   let newUser: Partial<User> = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phoneNumber: request.phoneNumber,
      isAdmin: request.isAdmin,
      isMfaVerified: false,
      notificationPreferences: {
         incomeNotifications: false,
         paymentNotifications: false
      }
   };
   newUser = await usersService.create(newUser);

   try {
      const userAuth: Partial<UserAuth> = {
         userId: newUser._id,
         hash: generateHash(request.password)
      };
      await usersAuthService.create(userAuth);
   } catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(newUser._id);
      throw error;
   }

   return {
      id: newUser._id.toHexString(),
      isAdmin: newUser.isAdmin,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      isMfaVerified: newUser.isMfaVerified,
      createdOn: newUser.createdOn,
      modifiedOn: newUser.modifiedOn
   };
};
