import BudgeterMongoClient from "services/external/mongodb/client";
import { PublicAPIKey } from "models/schemas/apiKey";
import { GetResponse } from "models/responses";

export const processGetAPIKeys = async (): Promise<
   GetResponse<PublicAPIKey>
> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const allApiKeys = await apiKeyService.findMany({});
   return {
      count: allApiKeys.length,
      values: allApiKeys.map((apiKey) => ({
         id: apiKey._id.toHexString(),
         key: apiKey.key
      }))
   };
};
