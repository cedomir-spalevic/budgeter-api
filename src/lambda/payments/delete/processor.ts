import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";

export const processDeletePayment = async (
   userId: ObjectId,
   paymentId: ObjectId
): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const payment = await paymentsService.find({
      userId: userId,
      _id: paymentId
   });
   if (!payment) throw new NotFoundError("No Payment found with the given Id");

   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   cachingStrategy.delete(userId);

   await paymentsService.delete(paymentId);
};
