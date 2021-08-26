import { graphqlAdminAuth } from "middleware/auth";
import { BudgeterRequestAuth } from "middleware/handler/lambda";
import { PublicAPIKey } from "models/schemas/apiKey";
import { ObjectId } from "mongodb";
import { createApiKey, deleteApiKey, getApiKeys } from "./processor";
import { validateDelete } from "./validators/validateDelete";

// Admin access only
const resolvers = {
   apiKeys: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicAPIKey[]> => {
      await graphqlAdminAuth(context);
      return getApiKeys();
   },
   createApiKey: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicAPIKey> => {
      await graphqlAdminAuth(context);
      return createApiKey();
   },
   deleteApiKey: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<ObjectId> => {
      await graphqlAdminAuth(context);
      const { apiKeyId } = validateDelete(args);
      return deleteApiKey(apiKeyId);
   }
}

export default resolvers;