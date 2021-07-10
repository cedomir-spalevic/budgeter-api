import { PublicBudgetItem } from "models/data/budgetItem";
import { Income } from "models/data/income";
import { NotFoundError } from "models/errors";
import { WithId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";

const allowedFieldsToUpdate: (keyof WithId<Income>)[] = [
   "title",
   "amount",
   "initialDay",
   "initialDate",
   "initialMonth",
   "initialYear",
   "recurrence"
];

export const processUpdateIncome = async (
   request: Partial<Income>
): Promise<PublicBudgetItem> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Issue with typescript. Otherwise I would not be able to update existingIncome[field] below
   // because apparently existingIncome comes out as a type of 'never'
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const existingIncome: any = await incomesService.find({
      userId: request.userId,
      _id: request._id
   });
   if (!existingIncome)
      throw new NotFoundError("No Income found with the given Id");

   // We only want to update the income with the differences. Not replace
   allowedFieldsToUpdate.forEach((field: keyof WithId<Income>) => {
      if (
         request[field] !== undefined &&
         existingIncome[field] !== request[field]
      )
         existingIncome[field] = request[field];
   });

   const updatedIncome = await incomesService.update(existingIncome);

   const cachingStrategy = new UserBudgetCachingStrategy("income");
   cachingStrategy.delete(existingIncome.userId);

   return {
      id: updatedIncome._id.toHexString(),
      title: updatedIncome.title,
      amount: updatedIncome.amount,
      initialDay: updatedIncome.initialDay,
      initialDate: updatedIncome.initialDate,
      initialMonth: updatedIncome.initialMonth,
      initialYear: updatedIncome.initialYear,
      recurrence: updatedIncome.recurrence,
      createdOn: updatedIncome.createdOn,
      modifiedOn: updatedIncome.modifiedOn
   };
};
