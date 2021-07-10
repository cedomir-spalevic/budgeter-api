import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";

export interface GetBudgetsRequest {
   userId: ObjectId;
   queryStrings: GetBudgetQueryStringParameters;
}