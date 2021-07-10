import { BudgeterRequest } from "middleware/handler";
import { PublicUser } from "models/data/user";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMe = async (request: BudgeterRequest): Promise<PublicUser> => {
   const { auth: { userId } } = request;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const user = await usersService.getById(userId.toHexString());
   return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isMfaVerified: user.isMfaVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn,
      device: {
         os: user.device ? user.device.os : null
      },
      notificationPreferences: {
         incomeNotifications: user.notificationPreferences.incomeNotifications,
         paymentNotifications: user.notificationPreferences.paymentNotifications
      }
   };
};
