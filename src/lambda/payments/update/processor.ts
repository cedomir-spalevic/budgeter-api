import { NoPaymentFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import PaymentsService from "services/external/mongodb/payments";

export const processUpdatePayment = async (userId: ObjectId, paymentId: ObjectId, name?: string, amount?: number, dueDate?: Date) => {
   const paymentsService = await PaymentsService.getInstance(userId);

   const payment = await paymentsService.getById(paymentId);
   if (payment === null)
      throw new NoPaymentFoundError();

   if (name)
      payment.name = name;
   if (amount)
      payment.amount = amount;
   if (dueDate)
      payment.dueDate = dueDate;
   await paymentsService.update(payment);
   return payment;
}