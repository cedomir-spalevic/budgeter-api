import { NoBudgetFoundError, NoPaymentFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";
import PaymentsService from "services/external/mongodb/payments";

export const processUpdatePayment = async (userId: ObjectId, budgetId: ObjectId, paymentId: ObjectId, completed: boolean): Promise<void> => {
   const budgetsService = await BudgetsService.getInstance(userId);
   const paymentsService = await PaymentsService.getInstance(userId);

   const budgetExists = await budgetsService.exists(budgetId);
   if (!budgetExists)
      throw new NoBudgetFoundError();

   const paymentExists = await paymentsService.exists(paymentId);
   if (!paymentExists)
      throw new NoPaymentFoundError();

   await budgetsService.updatePayment(budgetId, paymentId, completed);
}