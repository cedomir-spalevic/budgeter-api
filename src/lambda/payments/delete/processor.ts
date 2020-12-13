import { NoPaymentFoundError } from "models/errors";
import { ObjectId } from "mongodb";
import PaymentsService from "services/external/mongodb/payments";
import BudgetsService from "services/external/mongodb/budgets";

export const processDeletePayment = async (userId: ObjectId, paymentId: ObjectId) => {
   const paymentsService = await PaymentsService.getInstance(userId);
   const budgetsService = await BudgetsService.getInstance(userId);

   const paymentExists = await paymentsService.exists(paymentId);
   if (!paymentExists)
      throw new NoPaymentFoundError();

   const budgets = await budgetsService.getBudgetsWithPayment(paymentId);
   await Promise.all(budgets.map(async x => await budgetsService.removePayment(x._id, paymentId)));

   await paymentsService.delete(paymentId);
}