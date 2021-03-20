import { AdminPublicUser } from "models/data/user";
import { GeneralError, NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import { AdminUpdateUserRequestBody } from ".";

export const processUpdateUser = async (
   request: Partial<AdminUpdateUserRequestBody>
): Promise<AdminPublicUser> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();

   let user = await usersService.find({ _id: request.userId });
   if (!user) throw new NotFoundError("No User found with the given Id");

   if (request.userRequest.password !== undefined) {
      if (!request.userRequest.password)
         throw new GeneralError("Password cannot be blank");
      const userAuth = await usersAuthService.find({
         userId: request.userId,
      });
      userAuth.hash = generateHash(request.userRequest.password);
      await usersAuthService.update(userAuth);
   }

   if (
      request.userRequest.firstName !== undefined &&
      user.firstName !== request.userRequest.firstName
   )
      user.firstName = request.userRequest.firstName;
   if (
      request.userRequest.lastName !== undefined &&
      user.lastName !== request.userRequest.lastName
   )
      user.lastName = request.userRequest.lastName;
   if (
      request.userRequest.isAdmin !== undefined &&
      user.isAdmin !== request.userRequest.isAdmin
   )
      user.isAdmin = request.userRequest.isAdmin;

   user = await usersService.update(user);

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
