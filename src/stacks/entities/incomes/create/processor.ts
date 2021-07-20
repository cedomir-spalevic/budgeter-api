import { PublicBudgetItem } from "models/schemas/budgetItem";
import { Income } from "models/schemas/income";
import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";

export const processCreateIncome = async (
   request: Partial<Income>
): Promise<PublicBudgetItem> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.create(request);

   const cachingStrategy = new UserBudgetCachingStrategy("income");
   cachingStrategy.delete(income.userId);

   return {
      id: income._id.toHexString(),
      title: income.title,
      amount: income.amount,
      initialDay: income.initialDay,
      initialDate: income.initialDate,
      initialMonth: income.initialMonth,
      initialYear: income.initialYear,
      recurrence: income.recurrence,
      createdOn: income.createdOn,
      modifiedOn: income.modifiedOn
   };
};
