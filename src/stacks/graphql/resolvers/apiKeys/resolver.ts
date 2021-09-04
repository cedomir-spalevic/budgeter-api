import { ObjectId } from "mongodb";
import ApiKeyProcessor from "./processor";
import { BudgeterRequestAuth } from "models/requests";
import { PublicApiKey } from "models/schemas/apiKey";
import { graphqlAdminAuth } from "stacks/graphql/utils/auth";

// Admin access only
const resolvers = {
   apiKeys: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicApiKey[]> => {
      graphqlAdminAuth(context);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.get();
   },
   createApiKey: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicApiKey> => {
      graphqlAdminAuth(context);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.create();
   },
   deleteApiKey: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      graphqlAdminAuth(context);
      const apiKeyProcessor = await ApiKeyProcessor.getInstance();
      return apiKeyProcessor.delete(new ObjectId(args["id"] as string));
   }
};

export default resolvers;
