import { Income } from "models/data/income";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdateIncome = async (updatedIncome: Partial<Income>): Promise<any> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Make sure income exists
   let income = await incomesService.find({ userId: updatedIncome.userId, _id: updatedIncome._id });
   if (!income)
      throw new NotFoundError("No Income found with the given Id");

   // Check differences
   if (income.title !== updatedIncome.title)
      income.title = updatedIncome.title;
   if (income.amount !== updatedIncome.amount)
      income.amount = updatedIncome.amount;
   if (income.occurrenceDate !== updatedIncome.occurrenceDate)
      income.occurrenceDate = updatedIncome.occurrenceDate;
   if (income.recurrence !== updatedIncome.recurrence)
      income.recurrence = updatedIncome.recurrence;

   // Update Income
   income = await incomesService.update(income);

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