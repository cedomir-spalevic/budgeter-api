import { NoBudgetFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processUpdateBudget = async (userId: ObjectId, budgetId: ObjectId, name: any, startDate: any, endDate: any, completed: any) => {
   const budgetsService = await BudgetsService.getInstance(userId);

   const exists = await budgetsService.exists(budgetId);
   if (!exists)
      throw new NoBudgetFoundError();

   const budget = await budgetsService.getById(budgetId);
   if (name)
      budget.name = name;
   if (startDate)
      budget.startDate = startDate;
   if (endDate)
      budget.endDate = endDate;
   budget.completed = completed;
   await budgetsService.update(budget);
}


