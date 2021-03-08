import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeAccessToken } from "services/internal/security/accessToken";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import { StepFunctionBatchJobRequest } from "models/requests";

export const isAuthorized = async (event: APIGatewayProxyEvent): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token)
      throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeAccessToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   return new ObjectId(decodedToken.userId);
}

export const isAdminAuthorized = async (event: APIGatewayProxyEvent): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token)
      throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeAccessToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   return new ObjectId(decodedToken.userId);
}

export const isAPIKeyAuthorized = async (event: StepFunctionBatchJobRequest): Promise<void> => {
   const apiKey = event.Input.apiKey;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getAPIKeyCollection();

   const key = await apiKeyService.find({ key: generateHash(apiKey) });
   if (!key)
      throw new UnauthorizedError();
}