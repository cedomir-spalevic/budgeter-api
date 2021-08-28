import { GetBudgetQueryStringParameters } from "models/requests";
import { FilterQuery, ObjectId } from "mongodb";
import { Payment } from "models/schemas/payment";
import { Income } from "models/schemas/income";

export const getBudgetIncomeQuery = (
   userId: ObjectId,
   queryParams: GetBudgetQueryStringParameters
): FilterQuery<Income> => {
   const { month, year } = queryParams;
   return {
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
         },
         {
            initialYear: { $lte: year }
         }
      ]
   };
};

export const getBudgetPaymentQuery = (
   userId: ObjectId,
   queryParams: GetBudgetQueryStringParameters
): FilterQuery<Payment> => {
   const { month, year } = queryParams;
   return {
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
         },
         {
            initialYear: { $lte: year }
         }
      ]
   };
};
