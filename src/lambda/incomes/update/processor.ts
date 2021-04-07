import { Income, PublicIncome } from "models/data/income";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdateIncome = async (
   partiallyUpdatedIncome: Partial<Income>
): Promise<PublicIncome> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const existingIncome = await incomesService.find({
      userId: partiallyUpdatedIncome.userId,
      _id: partiallyUpdatedIncome._id
   });
   if (!existingIncome)
      throw new NotFoundError("No Income found with the given Id");

   // We only want to update the income with the differences. Not replace
   if (
      partiallyUpdatedIncome.title !== undefined &&
      existingIncome.title !== partiallyUpdatedIncome.title
   )
      existingIncome.title = partiallyUpdatedIncome.title;
   if (
      partiallyUpdatedIncome.amount !== undefined &&
      existingIncome.amount !== partiallyUpdatedIncome.amount
   )
      existingIncome.amount = partiallyUpdatedIncome.amount;
   if (
      partiallyUpdatedIncome.initialDay !== undefined &&
      existingIncome.initialDay !== partiallyUpdatedIncome.initialDay
   )
      existingIncome.initialDay = partiallyUpdatedIncome.initialDay;
   if (
      partiallyUpdatedIncome.initialDate !== undefined &&
      existingIncome.initialDate !== partiallyUpdatedIncome.initialDate
   )
      existingIncome.initialDate = partiallyUpdatedIncome.initialDate;
   if (
      partiallyUpdatedIncome.initialMonth !== undefined &&
      existingIncome.initialMonth !== partiallyUpdatedIncome.initialMonth
   )
      existingIncome.initialMonth = partiallyUpdatedIncome.initialMonth;
   if (
      partiallyUpdatedIncome.initialYear !== undefined &&
      existingIncome.initialYear !== partiallyUpdatedIncome.initialYear
   )
      existingIncome.initialYear = partiallyUpdatedIncome.initialYear;
   if (
      partiallyUpdatedIncome.recurrence !== undefined &&
      existingIncome.recurrence !== partiallyUpdatedIncome.recurrence
   )
      existingIncome.recurrence = partiallyUpdatedIncome.recurrence;

   const updatedIncome = await incomesService.update(existingIncome);

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
