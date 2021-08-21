import BudgeterMongoClient from "services/external/mongodb/client";
import { PublicAPIKey } from "models/schemas/apiKey";
import { getRandomKey } from "services/internal/security/randomKey";
import { generateHash } from "services/internal/security/hash";
import { ObjectId } from "mongodb";
import { NotFoundError } from "models/errors";

export const getApiKeys = async (): Promise<PublicAPIKey[]> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const allApiKeys = await apiKeyService.findMany({});
   return allApiKeys.map((apiKey) => ({
      id: apiKey._id.toHexString(),
      key: apiKey.key
   }))
};

export const createApiKey = async (): Promise<PublicAPIKey> => {
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

export const deleteApiKey = async (apiKeyId: ObjectId): Promise<ObjectId> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const apiKey = await apiKeyService.find({ _id: apiKeyId });
   if (!apiKey) throw new NotFoundError("No API Key found with the given Id");

   await apiKeyService.delete(apiKeyId);
   return apiKeyId;
}
