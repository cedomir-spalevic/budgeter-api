import { GetBudgetsBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { GetBudgetResponse } from "models/responses";
import { BudgetIncome } from "models/data/income";
import { getWeeklyOccurrenceLength, getBiweeklyOccurrenceLength } from "services/internal/datetime";
import { BudgetPayment } from "models/data/payment";

const getIncomes = async (request: GetBudgetsBody): Promise<BudgetIncome[]> => {
   const day = request.queryStrings.day;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();
   const response = await incomesService.findMany({
      "$or": [
         { initialMonth: month, initialYear: year, userId: userId, recurrence: "oneTime" },
         { userId: userId, recurrence: "daily" },
         { userId: userId, recurrence: "weekly" },
         { userId: userId, recurrence: "biweekly" },
         { initialMonth: month, userId: userId, recurrence: "monthly" },
         { initialMonth: month, recurrence: "yearly" }
      ]
   });

   const budgetIncomes: BudgetIncome[] = [];
   response.forEach(x => {
      if (x.recurrence === "oneTime" || x.recurrence === "monthly" || x.recurrence === "yearly") {
         budgetIncomes.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: x.initialDay === day,
            totalAmount: x.amount
         })
      }
      else if (x.recurrence === "daily") {
         budgetIncomes.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: true,
            totalAmount: x.amount * (new Date(year, month, 0).getDate())
         })
      }
      else if (x.recurrence === "weekly") {
         const today = new Date(year, month, day);
         const initialDate = new Date(x.initialYear, x.initialMonth, x.initialDay);
         const daysInMonth = getWeeklyOccurrenceLength(initialDate.getDay(), month, year);
         budgetIncomes.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: initialDate.getDay() === today.getDay(),
            totalAmount: x.amount * daysInMonth
         })
      }
      else if (x.recurrence === "biweekly") {
         const today = new Date(year, month, day);
         const initialDate = new Date(x.initialYear, x.initialMonth, x.initialDay);
         const daysInMonth = getBiweeklyOccurrenceLength(initialDate.getDay(), month, year);
         budgetIncomes.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: initialDate.getDay() === today.getDay(),
            totalAmount: x.amount * daysInMonth
         })
      }
   })
   return budgetIncomes;
}

const getPayments = async (request: GetBudgetsBody): Promise<BudgetPayment[]> => {
   const day = request.queryStrings.day;
   const month = request.queryStrings.month;
   const year = request.queryStrings.year;
   const userId = request.userId;

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();
   const response = await paymentsService.findMany({
      "$or": [
         { initialMonth: month, initialYear: year, userId: userId, recurrence: "oneTime" },
         { userId: userId, recurrence: "daily" },
         { userId: userId, recurrence: "weekly" },
         { userId: userId, recurrence: "biweekly" },
         { initialMonth: month, userId: userId, recurrence: "monthly" },
         { initialMonth: month, recurrence: "yearly" }
      ]
   });

   const budgetPayments: BudgetPayment[] = [];
   response.forEach(x => {
      if (x.recurrence === "oneTime" || x.recurrence === "monthly" || x.recurrence === "yearly") {
         budgetPayments.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: x.initialDay === day,
            totalAmount: x.amount
         })
      }
      else if (x.recurrence === "daily") {
         budgetPayments.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: true,
            totalAmount: x.amount * (new Date(year, month, 0).getDate())
         })
      }
      else if (x.recurrence === "weekly") {
         const today = new Date(year, month, day);
         const initialDate = new Date(x.initialYear, x.initialMonth, x.initialDay);
         const daysInMonth = getWeeklyOccurrenceLength(initialDate.getDay(), month, year);
         budgetPayments.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: initialDate.getDay() === today.getDay(),
            totalAmount: x.amount * daysInMonth
         })
      }
      else if (x.recurrence === "biweekly") {
         const today = new Date(year, month, day);
         const initialDate = new Date(x.initialYear, x.initialMonth, x.initialDay);
         const daysInMonth = getBiweeklyOccurrenceLength(initialDate.getDay(), month, year);
         budgetPayments.push({
            id: x._id.toHexString(),
            title: x.title,
            amount: x.amount,
            dueToday: initialDate.getDay() === today.getDay(),
            totalAmount: x.amount * daysInMonth
         })
      }
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