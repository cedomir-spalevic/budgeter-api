import { QueryStringParameters } from "middleware/url";
import { Payment, PublicPayment } from "models/data/payment";
import { NotFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { FilterQuery, ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMany = async (userId: ObjectId, queryStringParameters: QueryStringParameters): Promise<GetResponse<PublicPayment>> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   // Count number of payments user has
   const count = await paymentsService.count({ userId });

   // Get payments
   const query: FilterQuery<Payment> = {
      userId
   };
   if (queryStringParameters.search) {
      query.title = {
         "$regex": queryStringParameters.search,
         "$options": "$I"
      }
   }
   const limit = queryStringParameters.limit;
   const skip = queryStringParameters.skip;
   const values = await paymentsService.findMany(query, { limit, skip });

   return {
      count,
      values: values.map(x => ({
         id: x._id.toHexString(),
         title: x.title,
         amount: x.amount,
         occurrenceDate: x.occurrenceDate,
         recurrence: x.recurrence,
         createdOn: x.createdOn,
         modifiedOn: x.modifiedOn
      }))
   }
}

export const processGetSingle = async (userId: ObjectId, paymentId: ObjectId): Promise<PublicPayment> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const payment = await paymentsService.find({ userId, _id: paymentId });
   if (!payment)
      throw new NotFoundError("No Payment found with the given Id");

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