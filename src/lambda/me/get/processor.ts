import { User } from "models/data";
import { ObjectId } from "mongodb";
import UsersService from "services/external/mongodb/users";

export const processGetMe = async (userId: ObjectId): Promise<User> => {
   const usersService = await UsersService.getInstance();
   return await usersService.getById(userId);
}