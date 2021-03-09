import BudgeterMongoClient from "services/external/mongodb/client";

export const clearTokens = async (): Promise<void> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeTokenService = budgeterClient.getOneTimeCodeCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   // Delete all expired tokens
   const now = Date.now();
   await oneTimeTokenService.deleteAll({ expiresOn: { $lte: now } });
   await refreshTokenService.deleteAll({ expiresOn: { $lte: now } });
};
