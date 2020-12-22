import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isId, isValidJSONBody } from "middleware/validators";
import { ObjectId } from "mongodb";
import { processAddPayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);
      const form = isValidJSONBody(event.body);
      const paymentId = isId(form, "paymentId", true);

      await processAddPayment(userId, budgetId, new ObjectId(paymentId));
      return {
         statusCode: 201,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}