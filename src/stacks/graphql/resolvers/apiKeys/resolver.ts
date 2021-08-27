import { graphqlAdminAuth } from "middleware/auth";
import { ObjectId } from "mongodb";
import { validateDelete } from "./validators/validateDelete";
import ApiKeyProcessor from "./processor";
import { BudgeterRequestAuth } from "models/requests";
import { PublicApiKey } from "models/schemas/apiKey";

// Admin access only
const resolvers = {
   apiKeys: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicApiKey[]> => {
      await graphqlAdminAuth(context);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.get();
   },
   createApiKey: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicApiKey> => {
      await graphqlAdminAuth(context);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.create();
   },
   deleteApiKey: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<ObjectId> => {
      await graphqlAdminAuth(context);
      const { apiKeyId } = validateDelete(args);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.delete(apiKeyId);
   }
}

export default resolvers;