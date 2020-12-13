import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { processSignIn } from "./processor";
import { handleErrorResponse } from "middleware/errors";

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
      return handleErrorResponse(error);
   }
}