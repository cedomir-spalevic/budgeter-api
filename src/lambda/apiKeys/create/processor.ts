import { PublicAPIKey } from "models/data/apiKey";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import { getRandomKey } from "services/internal/security/randomKey";

export const processCreateAPIKey = async (): Promise<PublicAPIKey> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   // For all API Keys, I want to follow the format of budgeter/{key}
   const key = `budgeter/${getRandomKey()}`;
   const apiKey = await apiKeyService.create({ key: generateHash(key) });

   return {
      id: apiKey._id.toHexString(),
      key
   };
};
