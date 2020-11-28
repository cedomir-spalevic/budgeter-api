import { APIGatewayProxyEvent } from "aws-lambda";
import UsersService from "services/db/users";
import { decodeJwtToken } from "services/security";

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