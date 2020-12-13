import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { GeneralError, transformErrorToResponse, UnauthorizedError } from "models/errors";
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
      let statusCode: number;
      let body: string;
      if (error instanceof GeneralError) {
         statusCode = 400;
         body = transformErrorToResponse(error);
      }
      else if (error instanceof UnauthorizedError) {
         statusCode = 401;
         body = transformErrorToResponse(error);
      }
      else {
         statusCode = 500;
         body = transformErrorToResponse(error);
      }

      return { statusCode, body };
   }
}