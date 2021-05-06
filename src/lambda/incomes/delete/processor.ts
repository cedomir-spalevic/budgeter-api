import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import { ObjectId } from "mongodb";

export const processDeleteIncome = async (
   userId: ObjectId,
   incomeId: ObjectId
): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.find({
      userId: userId,
      _id: incomeId
   });
   if (!income) throw new NotFoundError("No Income found with the given Id");

   await incomesService.delete(incomeId);
};
