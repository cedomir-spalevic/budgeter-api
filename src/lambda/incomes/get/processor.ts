import { QueryStringParameters } from "middleware/url";
import { Income, PublicIncome } from "models/data/income";
import { NotFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { FilterQuery, ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMany = async (userId: ObjectId, queryStringParameters: QueryStringParameters): Promise<GetResponse<PublicIncome>> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Count number of incomes user has
   const count = await incomesService.count({ userId });

   // Get incomes
   const query: FilterQuery<Income> = {
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
   const values = await incomesService.findMany(query, { limit, skip });

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

export const processGetSingle = async (userId: ObjectId, incomeId: ObjectId): Promise<PublicIncome> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.find({ userId, _id: incomeId });
   if (!income)
      throw new NotFoundError("No Income found with the given Id");

   return {
      id: income._id.toHexString(),
      title: income.title,
      amount: income.amount,
      occurrenceDate: income.occurrenceDate,
      recurrence: income.recurrence,
      createdOn: income.createdOn,
      modifiedOn: income.modifiedOn
   };
}