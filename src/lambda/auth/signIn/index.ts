import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { processSignIn } from "./processor";
import { GeneralError, NoUserFoundError, transformErrorToResponse, UnauthorizedError } from "models/errors";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const form = JSON.parse(event.body);
      const email = form["email"];
      const password = form["password"];

      const response = await processSignIn(email, password);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      let statusCode: number;
      let body: string;
      if (error instanceof NoUserFoundError) {
         statusCode = 404;
         body = transformErrorToResponse(error);
      }
      else if (error instanceof GeneralError) {
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