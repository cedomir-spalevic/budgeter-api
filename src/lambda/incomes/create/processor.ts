import { Income, PublicIncome } from "models/data/income";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processCreateIncome = async (
   income: Partial<Income>
): Promise<PublicIncome> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Create income
   income = await incomesService.create(income);

   return {
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
   };
};
