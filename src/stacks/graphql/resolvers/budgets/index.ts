import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { GetBudgetResponse } from "models/responses";
import { getQuery } from "services/internal/budgets/query";
import { getBudgetItems } from "services/internal/budgets/determine";
import { PublicBudgetItemWithInfo } from "models/schemas/budgetItem";
import { BudgeterRequestAuth } from "middleware/handler";
import { GetBudgetQueryStringParameters } from "models/requests";

export const getBudget = async (
   request: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<GetBudgetResponse> => {
   console.log(request);
   console.log(context);
   const response = await Promise.all([
      await getIncomes(request, context),
      await getPayments(request, context)
   ]);

   return {
      incomes: response[0],
      payments: response[1]
   };
};

const getIncomes = async (
   request: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy("income");
   let incomes = await cachingStrategy.get(userId, request);
   if (!incomes) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const incomesService = budgeterClient.getIncomesCollection();
      const query = getQuery(userId, request);
      incomes = await incomesService.findMany(query);
      await cachingStrategy.set(userId, request, incomes);
   }
   return getBudgetItems(incomes, request);
};

const getPayments = async (
   request: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetItemWithInfo[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   let payments = await cachingStrategy.get(userId, request);
   if (!payments) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const paymentsService = budgeterClient.getPaymentsCollection();
      const query = getQuery(userId, request);
      payments = await paymentsService.findMany(query);
      await cachingStrategy.set(userId, request, payments);
   }
   return getBudgetItems(payments, request);
};
