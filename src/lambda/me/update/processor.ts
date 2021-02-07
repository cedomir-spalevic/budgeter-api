import { PublicUser, User } from "models/data/user";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdateUser = async (updatedUser: Partial<User>): Promise<PublicUser> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // Make sure user exists
   let user = await usersService.find({ _id: updatedUser._id });
   if (!user)
      throw new NotFoundError("No User found");

   // Check differences
   if (updatedUser.firstName !== undefined && user.firstName !== updatedUser.firstName)
      user.firstName = updatedUser.firstName;
   if (updatedUser.lastName !== undefined && user.lastName !== updatedUser.lastName)
      user.lastName = updatedUser.lastName;
   if (updatedUser.notificationPreferences.incomeNotifications !== undefined
      && user.notificationPreferences.incomeNotifications !== updatedUser.notificationPreferences.incomeNotifications)
      user.notificationPreferences.incomeNotifications = updatedUser.notificationPreferences.incomeNotifications;
   if (updatedUser.notificationPreferences.paymentNotifications !== undefined
      && user.notificationPreferences.paymentNotifications !== updatedUser.notificationPreferences.paymentNotifications)
      user.notificationPreferences.paymentNotifications = updatedUser.notificationPreferences.paymentNotifications;

   // Update User
   user = await usersService.update(user);

   return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.isEmailVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn,
      device: {
         os: (user.device ? user.device.os : null)
      },
      notificationPreferences: {
         incomeNotifications: user.notificationPreferences.incomeNotifications,
         paymentNotifications: user.notificationPreferences.paymentNotifications
      }
   }
}