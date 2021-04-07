import { PublicPayment, Payment } from "models/data/payment";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdatePayment = async (
   partiallyUpdatedPayment: Partial<Payment>
): Promise<PublicPayment> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const existingPayment = await paymentsService.find({
      userId: partiallyUpdatedPayment.userId,
      _id: partiallyUpdatedPayment._id
   });
   if (!existingPayment)
      throw new NotFoundError("No Payment found with the given Id");

   if (
      partiallyUpdatedPayment.title !== undefined &&
      existingPayment.title !== partiallyUpdatedPayment.title
   )
      existingPayment.title = partiallyUpdatedPayment.title;
   if (
      partiallyUpdatedPayment.amount !== undefined &&
      existingPayment.amount !== partiallyUpdatedPayment.amount
   )
      existingPayment.amount = partiallyUpdatedPayment.amount;
   if (
      partiallyUpdatedPayment.initialDay !== undefined &&
      existingPayment.initialDay !== partiallyUpdatedPayment.initialDay
   )
      existingPayment.initialDay = partiallyUpdatedPayment.initialDay;
   if (
      partiallyUpdatedPayment.initialDate !== undefined &&
      existingPayment.initialDate !== partiallyUpdatedPayment.initialDate
   )
      existingPayment.initialDate = partiallyUpdatedPayment.initialDate;
   if (
      partiallyUpdatedPayment.initialMonth !== undefined &&
      existingPayment.initialMonth !== partiallyUpdatedPayment.initialMonth
   )
      existingPayment.initialMonth = partiallyUpdatedPayment.initialMonth;
   if (
      partiallyUpdatedPayment.initialYear !== undefined &&
      existingPayment.initialYear !== partiallyUpdatedPayment.initialYear
   )
      existingPayment.initialYear = partiallyUpdatedPayment.initialYear;
   if (
      partiallyUpdatedPayment.recurrence !== undefined &&
      existingPayment.recurrence !== partiallyUpdatedPayment.recurrence
   )
      existingPayment.recurrence = partiallyUpdatedPayment.recurrence;

   const updatedPayment = await paymentsService.update(existingPayment);

   return {
      id: updatedPayment._id.toHexString(),
      title: updatedPayment.title,
      amount: updatedPayment.amount,
      initialDate: updatedPayment.initialDate,
      initialDay: updatedPayment.initialDay,
      initialMonth: updatedPayment.initialMonth,
      initialYear: updatedPayment.initialYear,
      recurrence: updatedPayment.recurrence,
      createdOn: updatedPayment.createdOn,
      modifiedOn: updatedPayment.modifiedOn
   };
};
