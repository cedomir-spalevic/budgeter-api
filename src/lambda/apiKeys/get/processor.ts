import BudgeterMongoClient from "services/external/mongodb/client";
import { PublicAPIKey } from "models/data/apiKey";
import { GetResponse } from "models/responses";

export const processGetAPIKeys = async (): Promise<GetResponse<PublicAPIKey>> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const response = await apiKeyService.findMany({})
   return {
      count: response.length,
      values: response.map(x => ({ id: x._id.toHexString(), key: x.key }))
   }
}