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
   if (payment.title !== updatedPayment.title)
      payment.title = updatedPayment.title;
   if (payment.amount !== updatedPayment.amount)
      payment.amount = updatedPayment.amount;
   if (payment.initialDay && payment.initialDay !== updatedPayment.initialDay)
      payment.initialDay = updatedPayment.initialDay;
   if (payment.initialDate && payment.initialDate !== updatedPayment.initialDate)
      payment.initialDate = updatedPayment.initialDate;
   if (payment.initialMonth && payment.initialMonth !== updatedPayment.initialMonth)
      payment.initialMonth = updatedPayment.initialMonth;
   if (payment.initialYear && payment.initialYear !== updatedPayment.initialYear)
      payment.initialYear = updatedPayment.initialYear;
   if (payment.recurrence && payment.recurrence !== updatedPayment.recurrence)
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