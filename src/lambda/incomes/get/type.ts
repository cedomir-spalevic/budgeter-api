import { PublicBudgetItem } from "models/data/budgetItem";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";

export interface GetIncomeRequest {
   userId: ObjectId;
   incomeId?: ObjectId;
   queryStrings?: GetListQueryStringParameters;
}


export type GetIncomeResponse = Promise<GetResponse<PublicBudgetItem> | PublicBudgetItem>;