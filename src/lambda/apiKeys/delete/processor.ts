import { DeleteAPIKeyBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { NotFoundError } from "models/errors";

export const processDeleteAPIKey = async (
   deleteAPIKeyBody: DeleteAPIKeyBody
): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const apiKey = await apiKeyService.find({ _id: deleteAPIKeyBody.apiKeyId });
   if (!apiKey) throw new NotFoundError("No API Key found with the given Id");

   await apiKeyService.delete(deleteAPIKeyBody.apiKeyId);
};
