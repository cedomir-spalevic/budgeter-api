import { Payment } from "models/data";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import PaymentsService from "services/external/mongodb/payments";

export const processCreatePayment = async (userId: ObjectId, name: string, amount: number, dueDate: Date): Promise<Payment> => {
   if (!name)
      throw new GeneralError("Name cannot be blank");
   if (amount <= 0)
      throw new GeneralError("Amount must be greatert than 0");
   if (!dueDate)
      throw new GeneralError("Due Date cannot be blank");

   const paymentsService = await PaymentsService.getInstance(userId);
   return await paymentsService.create(name, amount, dueDate);
}