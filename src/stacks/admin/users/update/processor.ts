import { AdminPublicUser } from "models/schemas/user";
import { GeneralError, NotFoundError } from "models/errors";
import { AdminUserRequest } from "models/requests";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";

export const processUpdateUser = async (
   request: AdminUserRequest
): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();

   let user = await usersService.find({ _id: request.userId });
   if (!user) throw new NotFoundError("No User found with the given Id");

   if (request.password !== undefined) {
      if (!request.password) throw new GeneralError("Password cannot be blank");
      const userAuth = await usersAuthService.find({
         userId: request.userId
      });
      userAuth.hash = generateHash(request.password);
      await usersAuthService.update(userAuth);
   }

   if (request.firstName !== undefined && user.firstName !== request.firstName)
      user.firstName = request.firstName;
   if (request.lastName !== undefined && user.lastName !== request.lastName)
      user.lastName = request.lastName;
   if (request.isAdmin !== undefined && user.isAdmin !== request.isAdmin)
      user.isAdmin = request.isAdmin;

   user = await usersService.update(user);

   return {
      id: user._id.toHexString(),
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isMfaVerified: user.isMfaVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn
   };
};
