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
      let dueToday: boolean, totalAmount: number, numberOfOccurrences: number;
      if (item.recurrence === "oneTime") {
         if (year !== item.initialYear || month !== item.initialMonth) return;
         dueToday = item.initialDate === date;
         numberOfOccurrences = 1;
         totalAmount = item.amount;
      } else if (item.recurrence === "monthly") {
         if (
            year < item.initialYear ||
            (year === item.initialYear && month < item.initialMonth)
         )
            return;
         dueToday = item.initialDate === date;
         numberOfOccurrences = 1;
         totalAmount = item.amount;
      } else if (item.recurrence === "yearly") {
         if (
            year < item.initialYear ||
            (year >= item.initialYear && month !== item.initialMonth)
         )
            return;
         dueToday = item.initialDate === date;
         numberOfOccurrences = 1;
         totalAmount = item.amount;
      } else if (item.recurrence === "daily") {
         if (
            year < item.initialYear ||
            (year === item.initialYear && month < item.initialMonth)
         )
            return;
         const daysInMonth = getNumberOfDaysInMonth(month, year);
         dueToday =
            month === item.initialMonth ? date >= item.initialDate : true;
         numberOfOccurrences =
            month === item.initialMonth
               ? daysInMonth -
                 (item.initialDate === 1 ? 0 : item.initialDate - 1)
               : daysInMonth;
         totalAmount = item.amount * numberOfOccurrences;
      } else if (item.recurrence === "weekly") {
         if (
            year < item.initialYear ||
            (year === item.initialYear && month < item.initialMonth)
         )
            return;
         dueToday = item.initialDay === new Date(year, month, date).getDay();
         if (
            year === item.initialYear &&
            month === item.initialMonth &&
            date < item.initialDate
         )
            dueToday = false;
         numberOfOccurrences = getWeeklyOccurrenceLength(
            year,
            month,
            item.initialDay,
            year === item.initialYear && month === item.initialMonth
               ? item.initialDate
               : 1
         );
         totalAmount = item.amount * numberOfOccurrences;
      } else {
         if (
            year < item.initialYear ||
            (year === item.initialYear && month < item.initialMonth)
         )
            return;
         const original = new Date(
            item.initialYear,
            item.initialMonth,
            item.initialDate
         );
         const given = new Date(year, month, date);
         dueToday =
            ((given.getTime() - original.getTime()) / (24 * 60 * 60 * 1000)) %
               14 ===
            0;
         if (
            year === item.initialYear &&
            month === item.initialMonth &&
            date < item.initialDate
         )
            dueToday = false;
         numberOfOccurrences = getBiweeklyOccurrenceLength(
            year,
            month,
            item.initialDay,
            year === item.initialYear && month === item.initialMonth
               ? item.initialDate
               : 1
         );
         totalAmount = item.amount * numberOfOccurrences;
      }
      publicBudgetItems.push({
         id: typeof item._id === "string" ? item._id : item._id.toHexString(),
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
