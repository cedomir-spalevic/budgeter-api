import { QueryStringParameters } from "middleware/url";
import { Income } from "models/data/income";
import { NotFoundError } from "models/errors";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";

export const processGetMany = async (userId: ObjectId, queryStringParameters: QueryStringParameters): Promise<GetResponse<Income>> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   // Count number of incomes user has
   const count = await incomesService.count({ userId });

   // Get incomes
   const limit = queryStringParameters.limit;
   const skip = queryStringParameters.skip;
   const values = await incomesService.findMany({ userId }, { limit, skip });

   return {
      count,
      values
   }
}

export const processGetSingle = async (userId: ObjectId, incomeId: ObjectId): Promise<Income> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const income = await incomesService.find({ userId, _id: incomeId });
   if (!income)
      throw new NotFoundError("No Income found with the given Id");

   return income;
}