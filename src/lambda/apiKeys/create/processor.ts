import { PublicAPIKey } from "models/data/apiKey";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import { getRandomKey } from "services/internal/security/randomKey";

export const processCreateAPIKey = async (): Promise<PublicAPIKey> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const key = `budgeter/${getRandomKey()}`
   const apiKey = await apiKeyService.create({ key: generateHash(key) });

   console.log(key)

   return {
      id: apiKey._id.toHexString(),
      key
   };
}