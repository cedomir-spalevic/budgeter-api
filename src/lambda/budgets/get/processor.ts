import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { GetBudgetResponse } from "models/responses";
import { getQuery } from "services/internal/budgets/query";
import { getBudgetItems } from "services/internal/budgets/determine";
import { PublicBudgetItemWithInfo } from "models/data/budgetItem";
import { GetBudgetsRequest } from "./type";

export const getBudget = async (
   request: GetBudgetsRequest
): Promise<GetBudgetResponse> => {
   const response = await Promise.all([
      await getIncomes(request),
      await getPayments(request)
   ]);

   return {
      incomes: response[0],
      payments: response[1]
   };
};

const getIncomes = async (
   request: GetBudgetsRequest
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = request;
   const cachingStrategy = new UserBudgetCachingStrategy("income");
   let incomes = await cachingStrategy.get(userId, request.queryStrings);
   if (!incomes) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const incomesService = budgeterClient.getIncomesCollection();
      const query = getQuery(userId, request.queryStrings);
      incomes = await incomesService.findMany(query);
      await cachingStrategy.set(userId, request.queryStrings, incomes);
   }
   return getBudgetItems(incomes, request.queryStrings);
};

const getPayments = async (
   request: GetBudgetsRequest
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = request;
   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   let payments = await cachingStrategy.get(userId, request.queryStrings);
   if (!payments) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const paymentsService = budgeterClient.getPaymentsCollection();
      const query = getQuery(userId, request.queryStrings);
      payments = await paymentsService.findMany(query);
      await cachingStrategy.set(userId, request.queryStrings, payments);
   }
   return getBudgetItems(payments, request.queryStrings);
};
