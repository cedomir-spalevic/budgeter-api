import { AdminPublicUser, User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { AlreadyExistsError } from "models/errors";
import { AdminUserRequest } from "models/requests";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";

export const processCreateUser = async (
   userRequest: AdminUserRequest
): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();

   const existingUser = await usersService.find({ 
      "$or" : [
         { 
            "$and": [
               { email: { "$ne": null } },
               { email: userRequest.email }
            ]
         },
         { 
            "$and": [
               { phoneNumber: { "$ne": null } },
               { phoneNumber: userRequest.phoneNumber }
            ]
         }
      ]
   });
   if (existingUser) throw new AlreadyExistsError();

   let newUser: Partial<User> = {
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      email: userRequest.email,
      phoneNumber: userRequest.phoneNumber,
      isAdmin: userRequest.isAdmin,
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
         hash: generateHash(userRequest.password)
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
