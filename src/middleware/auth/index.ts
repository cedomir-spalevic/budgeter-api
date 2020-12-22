import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import { decodeJwtToken } from "services/internal/security";
import UsersService from "services/external/mongodb/users";

export const isAuthorized = async (event: APIGatewayProxyEvent): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token)
      throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeJwtToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   const userId = new ObjectId(decodedToken.userId);

   const usersService = await UsersService.getInstance();
   const user = await usersService.getById(userId);
   if (user === null)
      throw new UnauthorizedError();

   return userId;
}

export const isAdminAuthorized = async (event: APIGatewayProxyEvent): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token)
      throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeJwtToken(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   const userId = new ObjectId(decodedToken.userId);

   const usersService = await UsersService.getInstance();
   const user = await usersService.getById(userId);
   if (user === null || !user.isAdmin)
      throw new UnauthorizedError();

   return userId;
}