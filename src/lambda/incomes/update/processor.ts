import { Income, PublicIncome } from "models/data/income";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdateIncome = async (
<<<<<<< HEAD
   partiallyUpdatedIncome: Partial<Income>
=======
   updatedIncome: Partial<Income>
>>>>>>> main
): Promise<PublicIncome> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

<<<<<<< HEAD
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
=======
   let income = await incomesService.find({
      userId: updatedIncome.userId,
      _id: updatedIncome._id
   });
   if (!income) throw new NotFoundError("No Income found with the given Id");

   // We only want to update the income with the differences. Not replace
   if (
      updatedIncome.title !== undefined &&
      income.title !== updatedIncome.title
   )
      income.title = updatedIncome.title;
   if (
      updatedIncome.amount !== undefined &&
      income.amount !== updatedIncome.amount
   )
      income.amount = updatedIncome.amount;
   if (
      updatedIncome.initialDay !== undefined &&
      income.initialDay !== updatedIncome.initialDay
   )
      income.initialDay = updatedIncome.initialDay;
   if (
      updatedIncome.initialDate !== undefined &&
      income.initialDate !== updatedIncome.initialDate
   )
      income.initialDate = updatedIncome.initialDate;
   if (
      updatedIncome.initialMonth !== undefined &&
      income.initialMonth !== updatedIncome.initialMonth
   )
      income.initialMonth = updatedIncome.initialMonth;
   if (
      updatedIncome.initialYear !== undefined &&
      income.initialYear !== updatedIncome.initialYear
   )
      income.initialYear = updatedIncome.initialYear;
   if (
      updatedIncome.recurrence !== undefined &&
      income.recurrence !== updatedIncome.recurrence
   )
      income.recurrence = updatedIncome.recurrence;

   income = await incomesService.update(income);

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
      modifiedOn: income.modifiedOn
>>>>>>> main
   };
};
