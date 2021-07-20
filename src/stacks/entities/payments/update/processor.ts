import { PublicBudgetItem } from "models/schemas/budgetItem";
import { Payment } from "models/schemas/payment";
import { NotFoundError } from "models/errors";
import { WithId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";

const allowedFieldsToUpdate: (keyof WithId<Payment>)[] = [
   "title",
   "amount",
   "initialDay",
   "initialDate",
   "initialMonth",
   "initialYear",
   "recurrence"
];

export const processUpdatePayment = async (
   request: Partial<Payment>
): Promise<PublicBudgetItem> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   // Issue with typescript. Otherwise I would not be able to update existingIncome[field] below
   // because apparently existingIncome comes out as a type of 'never'
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const existingPayment: any = await paymentsService.find({
      userId: request.userId,
      _id: request._id
   });
   if (!existingPayment)
      throw new NotFoundError("No Payment found with the given Id");

   allowedFieldsToUpdate.forEach((field: keyof WithId<Payment>) => {
      if (
         request[field] !== undefined &&
         existingPayment[field] !== request[field]
      )
         existingPayment[field] = request[field];
   });

   const updatedPayment = await paymentsService.update(existingPayment);

   const cachingStrategy = new UserBudgetCachingStrategy("payment");
   cachingStrategy.delete(existingPayment.userId);

   return {
      id: updatedPayment._id.toHexString(),
      title: updatedPayment.title,
      amount: updatedPayment.amount,
      initialDate: updatedPayment.initialDate,
      initialDay: updatedPayment.initialDay,
      initialMonth: updatedPayment.initialMonth,
      initialYear: updatedPayment.initialYear,
      recurrence: updatedPayment.recurrence,
      createdOn: updatedPayment.createdOn,
      modifiedOn: updatedPayment.modifiedOn
   };
};
