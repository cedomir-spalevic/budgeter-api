import { Payment } from "models/data";
import { NoPaymentFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import PaymentsService from "services/external/mongodb/payments";

export const processGetPayments = async (userId: ObjectId, limit: number, skip: number): Promise<Payment[]> => {
   const paymentsService = await PaymentsService.getInstance(userId);

   return await paymentsService.get(limit, skip);
}

export const processGetPayment = async (userId: ObjectId, paymentId: ObjectId): Promise<Payment> => {
   const paymentsService = await PaymentsService.getInstance(userId);

   const exists = await paymentsService.exists(paymentId);
   if (!exists)
      throw new NoPaymentFoundError();

   return await paymentsService.getById(paymentId);
}