import { APIGatewayProxyEvent } from "aws-lambda";
import { UnauthorizedError } from "models/errors";
import { ObjectId } from "mongodb";
import UsersService from "services/external/db/users";
import { decodeJwtToken, decodeJwtTokenNew } from "services/internal/security";
import UsersServiceNew from "services/external/mongodb/users";

export const isAuthorized = (event: APIGatewayProxyEvent): Promise<string> => {
   return new Promise((resolve, reject) => {
      let token = event.headers["Authorization"];
      if (!token)
         reject();

      token = token.replace("Bearer ", "");
      const decodedToken = decodeJwtToken(token);
      resolve(decodedToken.userId);
   })
}

export const isAuthorizedNew = async (event: APIGatewayProxyEvent): Promise<ObjectId> => {
   let token = event.headers["Authorization"];
   if (!token)
      throw new UnauthorizedError();

   token = token.replace("Bearer ", "");
   const decodedToken = decodeJwtTokenNew(token);
   if (!decodedToken.userId || !ObjectId.isValid(decodedToken.userId))
      throw new UnauthorizedError();
   const userId = new ObjectId(decodedToken.userId);

   const usersService = await UsersServiceNew.getInstance();
   const user = await usersService.getById(userId);
   if (user === null)
      throw new UnauthorizedError();

   return userId;
}

export const isAdminAuthorized = (event: APIGatewayProxyEvent): Promise<string> => {
   return new Promise(async (resolve, reject) => {
      let token = event.headers["Authorization"];
      if (!token)
         reject();

      token = token.replace("Bearer ", "");
      const decodedToken = decodeJwtToken(token);
      const userId = decodedToken.userId;
      const userService = new UsersService();
      const user = await userService.getUserById(userId);
      if (!user.isAdmin)
         reject();
      resolve(userId);
   })
}