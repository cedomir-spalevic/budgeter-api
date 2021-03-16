import { Income, PublicIncome } from "models/data/income";
import { NotFoundError } from "models/errors";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { FilterQuery, ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMany = async (
   userId: ObjectId,
   queryStringParameters: GetListQueryStringParameters
): Promise<GetResponse<PublicIncome>> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Count number of incomes user has
   const count = await incomesService.count({ userId });

   // Get incomes
   const query: FilterQuery<Income> = {
      userId,
   };
   if (queryStringParameters.search) {
      query.title = {
         $regex: queryStringParameters.search,
         $options: "$I",
      };
   }
   const limit = queryStringParameters.limit;
   const skip = queryStringParameters.skip;
   const values = await incomesService.findMany(query, { limit, skip });

   return {
      count,
      values: values.map((x) => ({
         id: x._id.toHexString(),
         title: x.title,
         amount: x.amount,
         initialDay: x.initialDay,
         initialDate: x.initialDate,
         initialMonth: x.initialMonth,
         initialYear: x.initialYear,
         recurrence: x.recurrence,
         createdOn: x.createdOn,
         modifiedOn: x.modifiedOn,
      })),
   };
};

export const processGetSingle = async (
   userId: ObjectId,
   incomeId: ObjectId
): Promise<PublicIncome> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.find({ userId, _id: incomeId });
   if (!income) throw new NotFoundError("No Income found with the given Id");

   return {
      id: income._id.toHexString(),
      title: income.title,
      amount: income.amount,
      initialDay: income.initialDay,
      initialDate: income.initialDate,
      initialMonth: income.initialMonth,
      initialYear: income.initialYear,
      recurrence: income.recurrence,
      createdOn: income.createdOn,
      modifiedOn: income.modifiedOn,
   };
};
