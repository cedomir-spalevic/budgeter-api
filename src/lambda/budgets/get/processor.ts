import { GetBudgetsBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { GetBudgetResponse } from "models/responses";
import { BudgetIncome } from "models/data/income";
import {
   getWeeklyOccurrenceLength,
   getBiweeklyOccurrenceLength,
   getNumberOfDaysInMonth
} from "services/internal/datetime";
import { BudgetPayment } from "models/data/payment";

export const getBudget = async (
   request: GetBudgetsBody
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

const getIncomes = async (request: GetBudgetsBody): Promise<BudgetIncome[]> => {
   const date = request.queryStrings.date;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();
   const incomes = await incomesService.findMany({
      $and: [
         { userId: userId },
         {
            $or: [
               {
                  initialMonth: month,
                  initialYear: year,
                  recurrence: "oneTime"
               },
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
   incomes.forEach((income) => {
      let dueToday: boolean, totalAmount: number, numberOfOccurrences: number;
      if (
         income.recurrence === "oneTime" ||
         income.recurrence === "monthly" ||
         income.recurrence === "yearly"
      ) {
         dueToday = income.initialDate === date;
         totalAmount = income.amount;
         numberOfOccurrences = 1;
      } else if (income.recurrence === "daily") {
         dueToday = true;
         totalAmount = income.amount * new Date(year, month, 0).getDate();
         numberOfOccurrences = getNumberOfDaysInMonth(month, year);
      } else if (income.recurrence === "weekly") {
         numberOfOccurrences = getWeeklyOccurrenceLength(
            income.initialDay,
            month,
            year
         );
         dueToday = income.initialDay === new Date(year, month, date).getDay();
         totalAmount = income.amount * numberOfOccurrences;
      } else {
         numberOfOccurrences = getBiweeklyOccurrenceLength(
            income.initialDay,
            month,
            year
         );
         dueToday = income.initialDay === new Date(year, month, date).getDay();
         totalAmount = income.amount * numberOfOccurrences;
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
         totalAmount: totalAmount,
         numberOfOccurrences: numberOfOccurrences
      });
   });
   return budgetIncomes;
};

const getPayments = async (
   request: GetBudgetsBody
): Promise<BudgetPayment[]> => {
   const date = request.queryStrings.date;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const payments = await paymentsService.findMany({
      $and: [
         { userId: userId },
         {
            $or: [
               {
                  initialMonth: month,
                  initialYear: year,
                  recurrence: "oneTime"
               },
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
   payments.forEach((payment) => {
      let dueToday: boolean, totalAmount: number, numberOfOccurrences: number;
      if (
         payment.recurrence === "oneTime" ||
         payment.recurrence === "monthly" ||
         payment.recurrence === "yearly"
      ) {
         dueToday = payment.initialDate === date;
         totalAmount = payment.amount;
         numberOfOccurrences = 1;
      } else if (payment.recurrence === "daily") {
         dueToday = true;
         totalAmount = payment.amount * new Date(year, month, 0).getDate();
         numberOfOccurrences = getNumberOfDaysInMonth(month, year);
      } else if (payment.recurrence === "weekly") {
         numberOfOccurrences = getWeeklyOccurrenceLength(
            payment.initialDay,
            month,
            year
         );
         dueToday = payment.initialDay === new Date(year, month, date).getDay();
         totalAmount = payment.amount * numberOfOccurrences;
      } else {
         numberOfOccurrences = getBiweeklyOccurrenceLength(
            payment.initialDay,
            month,
            year
         );
         dueToday = payment.initialDay === new Date(year, month, date).getDay();
         totalAmount = payment.amount * numberOfOccurrences;
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
         totalAmount: totalAmount,
         numberOfOccurrences: numberOfOccurrences
      });
   });
   return budgetPayments;
};
