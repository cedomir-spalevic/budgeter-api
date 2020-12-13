import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { processVerify } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      let token = "";
      const authorizationHeader = event.headers["Authorization"]
      if (authorizationHeader)
         token = authorizationHeader.replace("Bearer ", "");

      processVerify(token);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}