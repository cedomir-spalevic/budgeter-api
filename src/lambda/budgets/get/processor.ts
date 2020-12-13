import { Budget } from "models/data";
import { NoBudgetFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processGetBudgets = async (userId: ObjectId, limit: number, skip: number): Promise<GetResponse<Budget>> => {
   const budgetsService = await BudgetsService.getInstance(userId);
   const count = await budgetsService.count();
   const values = await budgetsService.get(limit, skip);
   return { count, values }
}

export const processGetBudget = async (userId: ObjectId, budgetId: ObjectId): Promise<Budget> => {
   const budgetsService = await BudgetsService.getInstance(userId);

   const exists = await budgetsService.exists(budgetId);
   if (!exists)
      throw new NoBudgetFoundError();

   return await budgetsService.getById(budgetId);
}