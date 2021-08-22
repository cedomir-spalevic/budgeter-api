import { AlreadyExistsError, GeneralError, NotFoundError } from "models/errors";
import { AdminUserRequest, GetListQueryStringParameters } from "models/requests";
import { AdminPublicUser, User } from "models/schemas/user";
import { UserAuth } from "models/schemas/userAuth";
import { FilterQuery, FindOneOptions, ObjectId, WithId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";

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

export const createUser = async (userInput: AdminUserRequest): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();

   const existingUser = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: userInput.email }]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: userInput.phoneNumber }
            ]
         }
      ]
   });
   if (existingUser) throw new AlreadyExistsError();

   const newUser: Partial<User> = {
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      phoneNumber: userInput.phoneNumber,
      isAdmin: userInput.isAdmin,
      isMfaVerified: false,
      notificationPreferences: {
         incomeNotifications: false,
         paymentNotifications: false
      }
   };
   const user = await usersService.create(newUser);

   try {
      const userAuth: Partial<UserAuth> = {
         userId: user._id,
         hash: generateHash(userInput.password)
      };
      await usersAuthService.create(userAuth);
   } catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(user._id);
      throw error;
   }

   return transformUserToPublicUser(user);
}

export const deleteUser = async (userId: ObjectId): Promise<ObjectId> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const incomesService = budgeterClient.getIncomesCollection();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const user = await usersService.find({ _id: userId });
   if (!user) throw new NotFoundError("No User found with the given Id");
   const userAuth = await usersAuthService.find({
      userId: userId
   });

   await usersService.delete(user._id);
   await usersAuthService.delete(userAuth._id);
   await incomesService.deleteAll({ userId: user._id });
   await paymentsService.deleteAll({ userId: user._id });

   return userId;
}

export const updateUser = async (userId: ObjectId, userInput: AdminUserRequest): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();

   let user = await usersService.find({ _id: userId });
   if (!user) throw new NotFoundError("No User found with the given Id");

   if (userInput.password !== undefined) {
      if (!userInput.password) throw new GeneralError("Password cannot be blank");
      const userAuth = await usersAuthService.find({ userId });
      userAuth.hash = generateHash(userInput.password);
      await usersAuthService.update(userAuth);
   }

   if (userInput.firstName !== undefined && user.firstName !== userInput.firstName)
      user.firstName = userInput.firstName;
   if (userInput.lastName !== undefined && user.lastName !== userInput.lastName)
      user.lastName = userInput.lastName;
   if (userInput.isAdmin !== undefined && user.isAdmin !== userInput.isAdmin)
      user.isAdmin = userInput.isAdmin;

   user = await usersService.update(user);

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