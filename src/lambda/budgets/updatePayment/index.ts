import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isBool, isValidJSONBody } from "middleware/validators";
import { processUpdatePayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);
      const paymentId = getPathParameter("paymentId", event.pathParameters);
      const form = isValidJSONBody(event.body);
      const completed = isBool(form, "completed", true);

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