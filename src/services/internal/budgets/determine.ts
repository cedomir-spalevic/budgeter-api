import { IBudgetItem, PublicBudgetItemWithInfo } from "models/data/budgetItem";
import { GetBudgetQueryStringParameters } from "models/requests";
import {
   getBiweeklyOccurrenceLength,
   getNumberOfDaysInMonth,
   getWeeklyOccurrenceLength
} from "../datetime";

export const getBudgetItems = (
   items: IBudgetItem[],
   query: GetBudgetQueryStringParameters
): PublicBudgetItemWithInfo[] => {
   const { date, month, year } = query;
   const publicBudgetItems: PublicBudgetItemWithInfo[] = [];
   items.forEach((item) => {
      if (item.initialYear === year && item.initialMonth > month) return;
      let dueToday: boolean, totalAmount: number, numberOfOccurrences: number;
      if (
         item.recurrence === "oneTime" ||
         item.recurrence === "monthly" ||
         item.recurrence === "yearly"
      ) {
         dueToday = item.initialDate === date;
         totalAmount = item.amount;
         numberOfOccurrences = 1;
      } else if (item.recurrence === "daily") {
         dueToday = true;
         totalAmount = item.amount * new Date(year, month, 0).getDate();
         numberOfOccurrences = getNumberOfDaysInMonth(month, year);
      } else if (item.recurrence === "weekly") {
         numberOfOccurrences = getWeeklyOccurrenceLength(
            item.initialDay,
            month,
            year
         );
         dueToday = item.initialDay === new Date(year, month, date).getDay();
         totalAmount = item.amount * numberOfOccurrences;
      } else {
         numberOfOccurrences = getBiweeklyOccurrenceLength(
            item.initialDay,
            month,
            year
         );
         dueToday = item.initialDay === new Date(year, month, date).getDay();
         totalAmount = item.amount * numberOfOccurrences;
      }
      publicBudgetItems.push({
         id: item._id.toHexString(),
         title: item.title,
         amount: item.amount,
         initialDay: item.initialDay,
         initialDate: item.initialDate,
         initialMonth: item.initialMonth,
         initialYear: item.initialYear,
         recurrence: item.recurrence,
         createdOn: item.createdOn,
         modifiedOn: item.modifiedOn,
         dueToday: dueToday,
         totalAmount: totalAmount,
         numberOfOccurrences: numberOfOccurrences
      });
   });
   return publicBudgetItems;
};
