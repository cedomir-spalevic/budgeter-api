import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { processDeleteBudget } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);

      await processDeleteBudget(userId, budgetId);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}