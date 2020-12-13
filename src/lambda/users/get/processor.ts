import { User } from "models/data";
import { NoUserFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";
import UsersService from "services/external/mongodb/users";

export const processGetUsers = async (limit: number, skip: number): Promise<GetResponse<User>> => {
   const usersService = await UsersService.getInstance();
   const count = await usersService.count();
   const values = await usersService.get(limit, skip);
   return { count, values };
}

export const processGetUser = async (userId: ObjectId): Promise<User> => {
   const usersService = await UsersService.getInstance();

   const user = await usersService.getById(userId);
   if (user === null)
      throw new NoUserFoundError();
   return user;
}