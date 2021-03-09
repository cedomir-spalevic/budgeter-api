import { Payment, PublicPayment } from "models/data/payment";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processCreatePayment = async (
   payment: Partial<Payment>
): Promise<PublicPayment> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   // Create income
   payment = await paymentsService.create(payment);

   return {
      id: payment._id.toHexString(),
      title: payment.title,
      amount: payment.amount,
      initialDay: payment.initialDay,
      initialDate: payment.initialDate,
      initialMonth: payment.initialMonth,
      initialYear: payment.initialYear,
      recurrence: payment.recurrence,
      createdOn: payment.createdOn,
      modifiedOn: payment.modifiedOn,
   };
};
