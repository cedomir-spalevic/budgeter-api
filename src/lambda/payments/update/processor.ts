import { PublicPayment, Payment } from "models/data/payment";
import { NotFoundError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processUpdatePayment = async (updatedPayment: Partial<Payment>): Promise<PublicPayment> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   // Make sure Payment exists
   let payment = await paymentsService.find({ userId: updatedPayment.userId, _id: updatedPayment._id });
   if (!payment)
      throw new NotFoundError("No Payment found with the given Id");

   // Check differences
   if (updatedPayment.title !== undefined && payment.title !== updatedPayment.title)
      payment.title = updatedPayment.title;
   if (updatedPayment.amount !== undefined && payment.amount !== updatedPayment.amount)
      payment.amount = updatedPayment.amount;
   if (updatedPayment.initialDay !== undefined && payment.initialDay !== updatedPayment.initialDay)
      payment.initialDay = updatedPayment.initialDay;
   if (updatedPayment.initialDate !== undefined && payment.initialDate !== updatedPayment.initialDate)
      payment.initialDate = updatedPayment.initialDate;
   if (updatedPayment.initialMonth !== undefined && payment.initialMonth !== updatedPayment.initialMonth)
      payment.initialMonth = updatedPayment.initialMonth;
   if (updatedPayment.initialYear !== undefined && payment.initialYear !== updatedPayment.initialYear)
      payment.initialYear = updatedPayment.initialYear;
   if (updatedPayment.recurrence !== undefined && payment.recurrence !== updatedPayment.recurrence)
      payment.recurrence = updatedPayment.recurrence;

   // Update Payment
   payment = await paymentsService.update(payment);

   return {
      id: payment._id.toHexString(),
      title: payment.title,
      amount: payment.amount,
      initialDate: payment.initialDate,
      initialDay: payment.initialDay,
      initialMonth: payment.initialMonth,
      initialYear: payment.initialYear,
      recurrence: payment.recurrence,
      createdOn: payment.createdOn,
      modifiedOn: payment.modifiedOn
   }
}