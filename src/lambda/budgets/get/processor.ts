import { GetBudgetsBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { GetBudgetResponse } from "models/responses";
import { BudgetIncome } from "models/data/income";
import { getWeeklyOccurrenceLength, getBiweeklyOccurrenceLength } from "services/internal/datetime";
import { BudgetPayment } from "models/data/payment";

const getIncomes = async (request: GetBudgetsBody): Promise<BudgetIncome[]> => {
   const date = request.queryStrings.date;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();
   const response = await incomesService.findMany({
      "$and": [
         { userId: userId },
         {
            "$or": [
               { initialMonth: month, initialYear: year, recurrence: "oneTime" },
               { recurrence: "daily" },
               { recurrence: "weekly" },
               { recurrence: "biweekly" },
               { recurrence: "monthly" },
               { initialMonth: month, recurrence: "yearly" }
            ]
         }
      ]
   });

   const budgetIncomes: BudgetIncome[] = [];
   response.forEach(income => {
      let dueToday: boolean, totalAmount: number;
      if (income.recurrence === "oneTime" || income.recurrence === "monthly" || income.recurrence === "yearly") {
         dueToday = income.initialDate === date;
         totalAmount = income.amount;
      }
      else if (income.recurrence === "daily") {
         dueToday = true;
         totalAmount = income.amount * (new Date(year, month, 0).getDate());
      }
      else if (income.recurrence === "weekly") {
         dueToday = income.initialDay === new Date(year, month, date).getDay();
         totalAmount = income.amount * getWeeklyOccurrenceLength(income.initialDay, month, year);
      }
      else {
         dueToday = income.initialDay === new Date(year, month, date).getDay();
         totalAmount = income.amount * getBiweeklyOccurrenceLength(income.initialDay, month, year);
      }
      budgetIncomes.push({
         id: income._id.toHexString(),
         title: income.title,
         amount: income.amount,
         initialDay: income.initialDay,
         initialDate: income.initialDate,
         initialMonth: income.initialMonth,
         initialYear: income.initialYear,
         recurrence: income.recurrence,
         createdOn: income.createdOn,
         modifiedOn: income.modifiedOn,
         dueToday: dueToday,
         totalAmount: totalAmount
      })
   })
   return budgetIncomes;
}

const getPayments = async (request: GetBudgetsBody): Promise<BudgetPayment[]> => {
   const date = request.queryStrings.date;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const response = await paymentsService.findMany({
      "$and": [
         { userId: userId },
         {
            "$or": [
               { initialMonth: month, initialYear: year, recurrence: "oneTime" },
               { recurrence: "daily" },
               { recurrence: "weekly" },
               { recurrence: "biweekly" },
               { recurrence: "monthly" },
               { initialMonth: month, recurrence: "yearly" }
            ]
         }
      ]
   });

   const budgetPayments: BudgetPayment[] = [];
   response.forEach(payment => {
      let dueToday: boolean, totalAmount: number;
      if (payment.recurrence === "oneTime" || payment.recurrence === "monthly" || payment.recurrence === "yearly") {
         dueToday = payment.initialDate === date;
         totalAmount = payment.amount;
      }
      else if (payment.recurrence === "daily") {
         dueToday = true;
         totalAmount = payment.amount * (new Date(year, month, 0).getDate());
      }
      else if (payment.recurrence === "weekly") {
         dueToday = payment.initialDay === new Date(year, month, date).getDay();
         totalAmount = payment.amount * getWeeklyOccurrenceLength(payment.initialDay, month, year);
      }
      else {
         dueToday = payment.initialDay === new Date(year, month, date).getDay();
         totalAmount = payment.amount * getBiweeklyOccurrenceLength(payment.initialDay, month, year);
      }
      budgetPayments.push({
         id: payment._id.toHexString(),
         title: payment.title,
         amount: payment.amount,
         initialDay: payment.initialDay,
         initialDate: payment.initialDate,
         initialMonth: payment.initialMonth,
         initialYear: payment.initialYear,
         recurrence: payment.recurrence,
         createdOn: payment.createdOn,
         modifiedOn: payment.modifiedOn,
         dueToday: dueToday,
         totalAmount: totalAmount
      })
   })
   return budgetPayments;
}

export const getBudget = async (request: GetBudgetsBody): Promise<GetBudgetResponse> => {
   const response = await Promise.all([
      await getIncomes(request),
      await getPayments(request)
   ]);

   return {
      incomes: response[0],
      payments: response[1]
   }
}