import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { DeleteIncomeRequest } from "./type";

export const processDeleteIncome = async (request: DeleteIncomeRequest): Promise<void> => {
   const { userId, incomeId } = request;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.find({
      userId: userId,
      _id: incomeId
   });
   if (!income) throw new NotFoundError("No Income found with the given Id");

   const cachingStrategy = new UserBudgetCachingStrategy("income");
   cachingStrategy.delete(income.userId);

   await incomesService.delete(incomeId);
};
