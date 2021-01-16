import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeAccessToken } from "services/internal/security/accessToken";

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