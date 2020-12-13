import { NoBudgetFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processAddPayment = async (userId: ObjectId, budgetId: ObjectId, paymentId: ObjectId): Promise<void> => {
   const budgetsService = await BudgetsService.getInstance(userId);
   const exists = await budgetsService.exists(budgetId);
   if (!exists)
      throw new NoBudgetFoundError();
   await budgetsService.addPayment(budgetId, paymentId);
}