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
   if (payment.occurrenceDate !== updatedPayment.occurrenceDate)
      payment.occurrenceDate = updatedPayment.occurrenceDate;
   if (payment.recurrence !== updatedPayment.recurrence)
      payment.recurrence = updatedPayment.recurrence;

   // Update Payment
   payment = await paymentsService.update(payment);

   return {
      id: payment._id.toHexString(),
      title: payment.title,
      amount: payment.amount,
      occurrenceDate: payment.occurrenceDate,
      recurrence: payment.recurrence,
      createdOn: payment.createdOn,
      modifiedOn: payment.modifiedOn
   }
}