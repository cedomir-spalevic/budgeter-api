import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await isAuthorized(event);

      return { statusCode: 200, body: "" }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}