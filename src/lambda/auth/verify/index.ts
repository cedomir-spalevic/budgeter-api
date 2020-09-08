import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { decodeJwtToken } from "services/security";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   let token = "";
   const authorizationHeader = event.headers["Authorization"]
   if (authorizationHeader)
      token = authorizationHeader.replace("Bearer ", "");

   // Verify the token is valid
   const valid = decodeJwtToken(token);
   return {
      statusCode: (valid ? 200 : 401),
      body: ""
   }
}