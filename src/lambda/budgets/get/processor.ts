import { GetBudgetsBody } from "./validator";
import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { GetBudgetResponse } from "models/responses";
import { getQuery } from "services/internal/budgets/query";
import { getBudgetItems } from "services/internal/budgets/determine";
import { PublicBudgetItemWithInfo } from "models/data/budgetItem";
import { ObjectId } from "mongodb";

export const getBudget = async (
   userId: ObjectId,
   request: GetBudgetsBody
): Promise<GetBudgetResponse> => {
   const response = await Promise.all([
      getIncomes(userId, request),
      getPayments(userId, request)
   ]);

   return {
      incomes: response[0],
      payments: response[1]
   };
};

const getIncomes = async (
   userId: ObjectId,
   request: GetBudgetsBody
): Promise<PublicBudgetItemWithInfo[]> => {
   const cachingStrategy = UserBudgetCachingStrategy.getInstance("income");
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
   userId: ObjectId,
   request: GetBudgetsBody
): Promise<PublicBudgetItemWithInfo[]> => {
   const cachingStrategy = UserBudgetCachingStrategy.getInstance("payment");
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
