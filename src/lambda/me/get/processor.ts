import { ObjectId } from "mongodb";
import UsersService from "services/external/mongodb/users";

export const processGetMe = async (userId: ObjectId): Promise<any> => {
   const usersService = await UsersService.getInstance();
   const user = await usersService.getById(userId);
   return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.isEmailVerified,
      createdOn: user.createdOn,
      modifiedOn: user.modifiedOn,
      device: {
         os: (user.device ? user.device.os : null)
      }
   }
}