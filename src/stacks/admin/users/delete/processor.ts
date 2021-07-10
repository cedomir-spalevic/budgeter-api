import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import { DeleteUserRequest } from "./type";

export const processDeleteUser = async (
   request: DeleteUserRequest
): Promise<void> => {
   const { userId } = request;
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
};
