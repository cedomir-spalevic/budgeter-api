import { Budget } from "models/data";
import { NoBudgetFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processGetBudgets = async (userId: ObjectId, limit: number, skip: number): Promise<Budget[]> => {
   const budgetsService = await BudgetsService.getInstance(userId);

   return await budgetsService.get(limit, skip);
}

export const processGetBudget = async (userId: ObjectId, budgetId: ObjectId): Promise<Budget> => {
   const budgetsService = await BudgetsService.getInstance(userId);

   const exists = await budgetsService.exists(budgetId);
   if (!exists)
      throw new NoBudgetFoundError();

   return await budgetsService.getById(budgetId);
}