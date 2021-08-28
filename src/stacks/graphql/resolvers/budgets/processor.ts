import {
   BudgeterRequestAuth,
   GetBudgetQueryStringParameters
} from "models/requests";
import {
   BudgetTypeValue,
   PublicBudgetIncome,
   PublicBudgetPayment
} from "models/schemas/budget";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import BudgeterMongoClient from "services/external/mongodb/client";
import {
   getBudgetIncomes,
   getBudgetPayments
} from "services/internal/budgets/determine";
import {
   getBudgetIncomeQuery,
   getBudgetPaymentQuery
} from "services/internal/budgets/query";
import { transformResponse as transformIncomes } from "../incomes/utils";
import { PublicIncome } from "models/schemas/income";
import { PublicPayment } from "models/schemas/payment";
import { transformResponse as transformPayments } from "../payments/utils";

export const getIncomes = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetIncome[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy<PublicIncome>(
      BudgetTypeValue.Income
   );
   let incomes = await cachingStrategy.get(userId, args);
   if (!incomes) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const incomesService = budgeterClient.getIncomesCollection();
      const query = getBudgetIncomeQuery(userId, args);
      const nIncome = await incomesService.findMany(query);
      incomes = nIncome.map(transformIncomes);
      await cachingStrategy.set(userId, args, incomes);
   }
   return getBudgetIncomes(incomes, args);
};

export const getPayments = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetPayment[]> => {
   const { userId } = context;
   const cachingStrategy = new UserBudgetCachingStrategy<PublicPayment>(
      BudgetTypeValue.Payment
   );
   let payments = await cachingStrategy.get(userId, args);
   if (!payments) {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const paymentsService = budgeterClient.getPaymentsCollection();
      const query = getBudgetPaymentQuery(userId, args);
      const nPayments = await paymentsService.findMany(query);
      payments = nPayments.map(transformPayments);
      await cachingStrategy.set(userId, args, payments);
   }
   return getBudgetPayments(payments, args);
};
