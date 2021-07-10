import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeAccessToken } from "services/internal/security/accessToken";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import { StepFunctionBatchJobRequest } from "models/requests";
import { BudgeterRequestAuth } from "middleware/handler";

export const adminAuth = async (
   event: APIGatewayProxyEvent
): Promise<BudgeterRequestAuth> => {
   const userId = await isAuthorized(event);
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = await budgeterClient.getUsersCollection();
   const user = await usersService.getById(userId.toHexString());
   if (!user || !user.isAdmin) throw new UnauthorizedError();
   return {
      isAuthenticated: true,
      userId
   };
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

export const isAuthorized = async (
   event: APIGatewayProxyEvent
): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token) throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeAccessToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   return new ObjectId(decodedToken.userId);
};

export const isAdminAuthorized = async (
   event: APIGatewayProxyEvent
): Promise<ObjectId> => {
   const userId = await isAuthorized(event);
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = await budgeterClient.getUsersCollection();
   const user = await usersService.getById(userId.toHexString());
   if (!user || !user.isAdmin) throw new UnauthorizedError();
   return userId;
};

export const isAPIKeyAuthorized = async (
   event: StepFunctionBatchJobRequest
): Promise<void> => {
   const apiKey = event.Payload.Input.apiKey;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const key = await apiKeyService.find({ key: generateHash(apiKey) });
   if (!key) throw new UnauthorizedError();
};
