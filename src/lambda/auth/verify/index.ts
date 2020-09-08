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
   let statusCode = 401;
   try {
      const valid = decodeJwtToken(token);
      if (valid)
         statusCode = 200;
   }
   catch (error) { }
   return {
      statusCode: statusCode,
      body: ""
   }
}