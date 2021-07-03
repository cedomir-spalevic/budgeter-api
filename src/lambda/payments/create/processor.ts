import { PublicBudgetItem } from "models/data/budgetItem";
import { Payment } from "models/data/payment";
import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";

export const processCreatePayment = async (
   payment: Partial<Payment>
): Promise<PublicBudgetItem> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   payment = await paymentsService.create(payment);

   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   cachingStrategy.delete(payment.userId);

   return {
      id: payment._id.toHexString(),
      title: payment.title,
      amount: payment.amount,
      initialDay: payment.initialDay,
      initialDate: payment.initialDate,
      initialMonth: payment.initialMonth,
      initialYear: payment.initialYear,
      recurrence: payment.recurrence,
      createdOn: payment.createdOn,
      modifiedOn: payment.modifiedOn
   };
};
