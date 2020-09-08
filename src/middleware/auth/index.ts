import { APIGatewayProxyEvent } from "aws-lambda";
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