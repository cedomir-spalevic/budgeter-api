import { PublicBudgetItem } from "models/schemas/budget";
import { Income } from "models/schemas/income";
import { NotFoundError } from "models/errors";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { FilterQuery, FindOneOptions, ObjectId } from "mongodb";
import BudgeterMongoClient from "services/external/mongodb/client";
import { GetIncomeRequest, GetIncomeResponse } from "./type";

export const processGetIncome = async (
   request: GetIncomeRequest
): GetIncomeResponse => {
   if (request.incomeId)
      return processGetSingle(request.userId, request.incomeId);
   return processGetMany(request.userId, request.queryStrings);
};

const processGetMany = async (
   userId: ObjectId,
   queryStringParameters: GetListQueryStringParameters
): Promise<GetResponse<PublicBudgetItem>> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const userIncomesAmount = await incomesService.count({ userId });

   const userIncomesQuery: FilterQuery<Income> = {
      userId
   };
   if (queryStringParameters.search) {
      userIncomesQuery.title = {
         $regex: queryStringParameters.search,
         $options: "$I"
      };
   }
   const queryOptions: FindOneOptions<Income> = {
      limit: queryStringParameters.limit,
      skip: queryStringParameters.skip
   };
   const userIncomes = await incomesService.findMany(
      userIncomesQuery,
      queryOptions
   );

   return {
      count: userIncomesAmount,
      values: userIncomes.map((x) => ({
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

const processGetSingle = async (
   userId: ObjectId,
   incomeId: ObjectId
): Promise<PublicBudgetItem> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const incomesService = budgeterClient.getIncomesCollection();

   const userIncome = await incomesService.find({ userId, _id: incomeId });
   if (!userIncome)
      throw new NotFoundError("No Income found with the given Id");

   return {
      id: userIncome._id.toHexString(),
      title: userIncome.title,
      amount: userIncome.amount,
      initialDay: userIncome.initialDay,
      initialDate: userIncome.initialDate,
      initialMonth: userIncome.initialMonth,
      initialYear: userIncome.initialYear,
      recurrence: userIncome.recurrence,
      createdOn: userIncome.createdOn,
      modifiedOn: userIncome.modifiedOn
   };
};
