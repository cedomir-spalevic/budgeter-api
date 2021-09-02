import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeAccessToken } from "services/internal/security/accessToken";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import {
   BudgeterRequestAuth,
   StepFunctionBatchJobRequest
} from "models/requests";

export const apiKeyAuth = async (
   event: StepFunctionBatchJobRequest
): Promise<void> => {
   const apiKey = event.Payload.Input.apiKey;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getApiKeyCollection();

   const key = await apiKeyService.find({ key: generateHash(apiKey) });
   if (!key) throw new UnauthorizedError();
};

export const graphqlAdminAuth = async (
   request: BudgeterRequestAuth
): Promise<void> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = await budgeterClient.getUsersCollection();
   const user = await usersService.getById(request.userId.toHexString());
   if (!user || !user.isAdmin) throw new UnauthorizedError();
};

export const adminAuth = async (
   event: APIGatewayProxyEvent
): Promise<BudgeterRequestAuth> => {
   const response = await auth(event);
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = await budgeterClient.getUsersCollection();
   const user = await usersService.getById(response.userId.toHexString());
   if (!user || !user.isAdmin) throw new UnauthorizedError();
   return response;
};

export const auth = async (
   event: APIGatewayProxyEvent
): Promise<BudgeterRequestAuth> => {
   let token = event.headers["Authorization"];
   if (!token) throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeAccessToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   return {
      isAuthenticated: true,
      userId: new ObjectId(decodedToken.userId)
   };
};
