import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { processUpdatePayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);
      const paymentId = getPathParameter("paymentId", event.pathParameters);
      const form = JSON.parse(event.body);
      const completed = form["completed"];

      await processUpdatePayment(userId, budgetId, paymentId, completed);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}