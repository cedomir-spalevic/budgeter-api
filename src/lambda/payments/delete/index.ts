import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { getPathParameter } from "middleware/url";
import { handleErrorResponse } from "middleware/errors";
import { processDeletePayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const paymentId = getPathParameter("paymentId", event.pathParameters);

      await processDeletePayment(userId, paymentId);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}