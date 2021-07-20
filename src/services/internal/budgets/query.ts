import { IBudgetItem } from "models/schemas/budgetItem";
import { GetBudgetQueryStringParameters } from "models/requests";
import { FilterQuery, ObjectId } from "mongodb";

export const getQuery = (
   userId: ObjectId,
   queryParams: GetBudgetQueryStringParameters
): FilterQuery<IBudgetItem> => {
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
