import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";
import { DeleteApiKeyRequest } from "./type";

export const processDeleteAPIKey = async (
   request: DeleteApiKeyRequest
): Promise<void> => {
   const { apiKeyId } = request;

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const apiKey = await apiKeyService.find({ _id: apiKeyId });
   if (!apiKey) throw new NotFoundError("No API Key found with the given Id");

   await apiKeyService.delete(apiKeyId);
};
