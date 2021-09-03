import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeAccessToken } from "services/internal/security/accessToken";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateHash } from "services/internal/security/hash";
import {
   BudgeterRequestAuth,
   StepFunctionBatchJobRequest
} from "models/requests";
import { Token } from "models/auth";

const getAccessTokenFromHeader = (
   headers: APIGatewayProxyEventHeaders
): string => {
   let token = headers["Authorization"];
   if (!token) throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   return token;
};

const attemptAccessTokenDecode = (
   token: string,
   tryAsAdmin?: boolean
): Token => {
   const decodedToken = decodeAccessToken(token, tryAsAdmin);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   return decodedToken;
};

export const apiKeyAuth = async (
   event: StepFunctionBatchJobRequest
): Promise<void> => {
   const apiKey = event.Payload.Input.apiKey;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const apiKeyService = budgeterClient.getApiKeyCollection();

   const key = await apiKeyService.find({ key: generateHash(apiKey) });
   if (!key) throw new UnauthorizedError();
};

export const adminAuth = async (
   event: APIGatewayProxyEvent
): Promise<BudgeterRequestAuth> => {
   const token = getAccessTokenFromHeader(event.headers);
   const decodedToken = attemptAccessTokenDecode(token, true);
   return {
      isAuthenticated: true,
      isAdmin: true,
      userId: new ObjectId(decodedToken.userId)
   };
};

export const auth = async (
   event: APIGatewayProxyEvent
): Promise<BudgeterRequestAuth> => {
   const token = getAccessTokenFromHeader(event.headers);
   let decodedToken: Token;
   let isAdmin = false;
   try {
      decodedToken = attemptAccessTokenDecode(token, false);
   } catch (error) {
      // If it fails a second time, return 401
      decodedToken = attemptAccessTokenDecode(token, true);
      isAdmin = true;
   }
   return {
      isAuthenticated: true,
      isAdmin,
      userId: new ObjectId(decodedToken.userId)
   };
};
