import { Income } from "models/data/income";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processCreateIncome = async (income: Partial<Income>): Promise<any> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Create income
   income = await incomesService.create(income);

   return {
      id: income._id.toHexString(),
      title: income.title,
      amount: income.amount,
      occurrenceDate: income.occurrenceDate,
      recurrence: income.recurrence,
      createdOn: income.createdOn,
      modifiedOn: income.modifiedOn
   }
}