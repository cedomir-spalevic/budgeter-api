import { NoBudgetFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processDeleteBudget = async (userId: ObjectId, budgetId: ObjectId) => {
   const budgetsService = await BudgetsService.getInstance(userId);

   const budget = await budgetsService.exists(budgetId);
   if (budget === null)
      throw new NoBudgetFoundError();

   await budgetsService.delete(budgetId);
}