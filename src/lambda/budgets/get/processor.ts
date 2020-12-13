import { Budget } from "models/data-new";
import { NoBudgetFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processGetBudgets = async (userId: ObjectId, limit: number, skip: number): Promise<any[]> => {
   return [];
}

export const processGetBudget = async (userId: ObjectId, budgetId: ObjectId): Promise<Budget> => {
   const budgetsService = await BudgetsService.getInstance(userId);

   const exists = await budgetsService.exists(budgetId);
   if (!exists)
      throw new NoBudgetFoundError();

   return await budgetsService.getById(budgetId);

   // Get budgets
   // try {
   //    const budgetPaymentsService = new BudgetPaymentsService(userId);
   //    const budgetsService = new BudgetsService(userId);
   //    let budgets = await budgetsService.get();
   //    budgets = await Promise.all((await budgets).map(async x => {
   //       x.payments = await budgetPaymentsService.getAll(x.budgetId);
   //       return x;
   //    }));
   //    return {
   //       statusCode: 200,
   //       body: JSON.stringify(budgets)
   //    }
   // }
   // catch (error) {
   //    return {
   //       statusCode: 400,
   //       body: "Unable to get budget"
   //    };
   // }
}