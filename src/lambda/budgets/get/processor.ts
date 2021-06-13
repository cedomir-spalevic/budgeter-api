import { GetBudgetsBody } from "./validator";
import BudgeterMongoClient from "services/external/mongodb/client";
import { getUserIncomeBudgetCache, getUserPaymentBudgetCache, setUserIncomeBudgetCache, setUserPaymentBudgetCache } from "services/internal/caching/budgets";
import { GetBudgetResponse } from "models/responses";
import { getQuery } from "services/internal/budgets/query";
import { getBudgetItems } from "services/internal/budgets/determine";
import { IBudgetItem, PublicBudgetItemWithInfo } from "models/data/budgetItem";
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
   let incomes = await getUserIncomeBudgetCache(userId, request.queryStrings);
   if(!incomes) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const incomesService = budgeterClient.getIncomesCollection();
      const query = getQuery(userId, request.queryStrings);
      incomes = await incomesService.findMany(query) as IBudgetItem[];
      await setUserIncomeBudgetCache(userId, request.queryStrings, incomes);
   }
   return getBudgetItems(incomes, request.queryStrings);
};

const getPayments = async (
   userId: ObjectId,
   request: GetBudgetsBody
): Promise<PublicBudgetItemWithInfo[]> => {
   let payments = await getUserPaymentBudgetCache(userId, request.queryStrings);
   if(!payments) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const paymentsService = budgeterClient.getPaymentsCollection();
      const query = getQuery(userId, request.queryStrings);
      payments = await paymentsService.findMany(query) as IBudgetItem[];
      await setUserPaymentBudgetCache(userId, request.queryStrings, payments);
   }
   return getBudgetItems(payments, request.queryStrings);
};
