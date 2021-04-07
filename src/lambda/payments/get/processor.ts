import { Payment, PublicPayment } from "models/data/payment";
import { NotFoundError } from "models/errors";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { FilterQuery, FindOneOptions, ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMany = async (
   userId: ObjectId,
   queryStringParameters: GetListQueryStringParameters
): Promise<GetResponse<PublicPayment>> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const userPaymentsAmount = await paymentsService.count({ userId });

   const userPaymentsQuery: FilterQuery<Payment> = {
      userId
   };
   if (queryStringParameters.search) {
      userPaymentsQuery.title = {
         $regex: queryStringParameters.search,
         $options: "$I"
      };
   }
   const queryOptions: FindOneOptions<Payment> = {
      limit: queryStringParameters.limit,
      skip: queryStringParameters.skip
   };
   const userPayments = await paymentsService.findMany(
      userPaymentsQuery,
      queryOptions
   );

   return {
      count: userPaymentsAmount,
      values: userPayments.map((x) => ({
         id: x._id.toHexString(),
         title: x.title,
         amount: x.amount,
         initialDay: x.initialDay,
         initialDate: x.initialDate,
         initialMonth: x.initialMonth,
         initialYear: x.initialYear,
         recurrence: x.recurrence,
         createdOn: x.createdOn,
         modifiedOn: x.modifiedOn
      }))
   };
};

export const processGetSingle = async (
   userId: ObjectId,
   paymentId: ObjectId
): Promise<PublicPayment> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const paymentsService = budgeterClient.getPaymentsCollection();

   const payment = await paymentsService.find({ userId, _id: paymentId });
   if (!payment) throw new NotFoundError("No Payment found with the given Id");

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
      modifiedOn: payment.modifiedOn
   };
};
