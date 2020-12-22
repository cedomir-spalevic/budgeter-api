import { Payment } from "models/data";
import { NoPaymentFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";
import PaymentsService from "services/external/mongodb/payments";

export const processGetPayments = async (userId: ObjectId, limit: number, skip: number): Promise<GetResponse<Payment>> => {
   const paymentsService = await PaymentsService.getInstance(userId);
   const count = await paymentsService.count();
   const values = await paymentsService.get(limit, skip);
   return { count, values }
}

export const processGetPayment = async (userId: ObjectId, paymentId: ObjectId): Promise<Payment> => {
   const paymentsService = await PaymentsService.getInstance(userId);

   const exists = await paymentsService.exists(paymentId);
   if (!exists)
      throw new NoPaymentFoundError();

   return await paymentsService.getById(paymentId);
}