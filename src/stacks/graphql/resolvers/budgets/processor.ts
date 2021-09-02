import {
   BudgeterRequestAuth,
   GetBudgetQueryStringParameters
} from "models/requests";
import { PublicBudgetIncome, PublicBudgetPayment } from "models/schemas/budget";
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
import { transformResponse as transformPayments } from "../payments/utils";

export const getIncomes = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetIncome[]> => {
   const { userId } = context;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();
   const query = getBudgetIncomeQuery(userId, args);
   const rawIncomes = await incomesService.findMany(query);
   const incomes = rawIncomes.map(transformIncomes);
   return getBudgetIncomes(incomes, args);
};

export const getPayments = async (
   args: GetBudgetQueryStringParameters,
   context: BudgeterRequestAuth
): Promise<PublicBudgetPayment[]> => {
   const { userId } = context;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const query = getBudgetPaymentQuery(userId, args);
   const rawPayments = await paymentsService.findMany(query);
   const payments = rawPayments.map(transformPayments);
   return getBudgetPayments(payments, args);
};
