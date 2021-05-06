import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import { ObjectId } from "mongodb";

export const processDeleteUser = async (userId: ObjectId): Promise<void> => {
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
