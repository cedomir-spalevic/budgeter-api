import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { GetBudgetResponse } from "models/responses";
import { getQuery } from "services/internal/budgets/query";
import { getBudgetItems } from "services/internal/budgets/determine";
import { PublicBudgetItemWithInfo } from "models/schemas/budget";
import { BudgeterRequestAuth } from "middleware/handler/lambda";
import { GetBudgetQueryStringParameters } from "models/requests";

export const getBudget = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<GetBudgetResponse> => {
   const response = await Promise.all([
      await getIncomes(args, context),
      await getPayments(args, context)
   ]);

   return {
      incomes: response[0],
      payments: response[1]
   };
};

const getIncomes = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy("income");
   let incomes = await cachingStrategy.get(userId, args);
   if (!incomes) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const incomesService = budgeterClient.getIncomesCollection();
      const query = getQuery(userId, args);
      incomes = await incomesService.findMany(query);
      await cachingStrategy.set(userId, args, incomes);
   }
   return getBudgetItems(incomes, args);
};

const getPayments = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   let payments = await cachingStrategy.get(userId, args);
   if (!payments) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const paymentsService = budgeterClient.getPaymentsCollection();
      const query = getQuery(userId, args);
      payments = await paymentsService.findMany(query);
      await cachingStrategy.set(userId, args, payments);
   }
   return getBudgetItems(payments, args);
};
