import { PublicUser } from "models/data/user";
import { ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMe = async (userId: ObjectId): Promise<PublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const user = await usersService.getById(userId.toHexString());
   return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.isEmailVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn,
      device: {
         os: user.device ? user.device.os : null,
      },
      notificationPreferences: {
         incomeNotifications: user.notificationPreferences.incomeNotifications,
         paymentNotifications:
            user.notificationPreferences.paymentNotifications,
      },
   };
};
