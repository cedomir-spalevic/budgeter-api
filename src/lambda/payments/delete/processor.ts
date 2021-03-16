import { DeletePaymentBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";

export const processDeletePayment = async (
   deletePaymentBody: DeletePaymentBody
): Promise<void> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   // Make sure Payment exists
   const payment = await paymentsService.find({
      userId: deletePaymentBody.userId,
      _id: deletePaymentBody.paymentId,
   });
   if (!payment) throw new NotFoundError("No Payment found with the given Id");

   await paymentsService.delete(deletePaymentBody.paymentId);
};
