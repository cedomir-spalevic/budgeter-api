import { PublicUser, User } from "models/data/user";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdateUser = async (
   partiallyUpdatedUser: Partial<User>
): Promise<PublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   const existingUser = await usersService.find({
      _id: partiallyUpdatedUser._id
   });
   if (!existingUser) throw new NotFoundError("No existingUser found");

   if (
      partiallyUpdatedUser.firstName !== undefined &&
      existingUser.firstName !== partiallyUpdatedUser.firstName
   )
      existingUser.firstName = partiallyUpdatedUser.firstName;
   if (
      partiallyUpdatedUser.lastName !== undefined &&
      existingUser.lastName !== partiallyUpdatedUser.lastName
   )
      existingUser.lastName = partiallyUpdatedUser.lastName;
   if (
      partiallyUpdatedUser.notificationPreferences.incomeNotifications !==
         undefined &&
      existingUser.notificationPreferences.incomeNotifications !==
         partiallyUpdatedUser.notificationPreferences.incomeNotifications
   )
      existingUser.notificationPreferences.incomeNotifications =
         partiallyUpdatedUser.notificationPreferences.incomeNotifications;
   if (
      partiallyUpdatedUser.notificationPreferences.paymentNotifications !==
         undefined &&
      existingUser.notificationPreferences.paymentNotifications !==
         partiallyUpdatedUser.notificationPreferences.paymentNotifications
   )
      existingUser.notificationPreferences.paymentNotifications =
         partiallyUpdatedUser.notificationPreferences.paymentNotifications;

   const updatedUser = await usersService.update(existingUser);

   return {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      emailVerified: updatedUser.isEmailVerified,
      createdOn: updatedUser.createdOn,
      modifiedOn: updatedUser.modifiedOn,
      device: {
         os: updatedUser.device ? updatedUser.device.os : null
      },
      notificationPreferences: {
         incomeNotifications:
            updatedUser.notificationPreferences.incomeNotifications,
         paymentNotifications:
            updatedUser.notificationPreferences.paymentNotifications
      }
   };
};
