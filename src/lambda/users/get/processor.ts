import { User } from "models/data";
import { NoUserFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import UsersService from "services/external/mongodb/users";

export const processGetUsers = async (limit: number, skip: number): Promise<User[]> => {
   const usersService = await UsersService.getInstance();

   return await usersService.get(limit, skip);
}

export const processGetUser = async (userId: ObjectId): Promise<User> => {
   const usersService = await UsersService.getInstance();

   const user = await usersService.getById(userId);
   if (user === null)
      throw new NoUserFoundError();
   return user;
}