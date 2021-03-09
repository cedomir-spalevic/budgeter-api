import { DeleteIncomeBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";

export const processDeleteIncome = async (
   deleteIncomeBody: DeleteIncomeBody
): Promise<void> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Make sure Income exists
   const income = await incomesService.find({
      userId: deleteIncomeBody.userId,
      _id: deleteIncomeBody.incomeId,
   });
   if (!income) throw new NotFoundError("No Income found with the given Id");

   await incomesService.delete(deleteIncomeBody.incomeId);
};
