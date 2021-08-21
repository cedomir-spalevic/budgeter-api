import { NotFoundError } from "models/errors";
import { GetListQueryStringParameters } from "models/requests";
import { AdminPublicUser, User } from "models/schemas/user";
import { FilterQuery, FindOneOptions, ObjectId, WithId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const getUsers = async(queryStringParameters: GetListQueryStringParameters): Promise<AdminPublicUser[]> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   const query: FilterQuery<User> = {};
   const queryOptions: FindOneOptions<User> = {
      limit: queryStringParameters.limit,
      skip: queryStringParameters.skip
   };
   const users = await usersService.findMany(query, queryOptions);

   return users.map((user) => transformUserToPublicUser(user))
}

export const getUserById = async (userId: ObjectId): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   const user = await usersService.find({ _id: userId });
   if (!user) throw new NotFoundError("No User found with the given Id");

   return transformUserToPublicUser(user);
}

const transformUserToPublicUser = (user: WithId<User>): AdminPublicUser => ({
   id: user._id.toHexString(),
   firstName: user.firstName,
   lastName: user.lastName,
   email: user.email,
   phoneNumber: user.phoneNumber,
   isAdmin: user.isAdmin,
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
})