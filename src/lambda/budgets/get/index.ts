import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter, getQueryStringParameters } from "middleware/url";
import { processGetBudget, processGetBudgets } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      let response;
      if (event.pathParameters === null) {
         const queryStrings = getQueryStringParameters(event.queryStringParameters);
         response = await processGetBudgets(userId, queryStrings.limit, queryStrings.skip);
      }
      else {
         const budgetId = getPathParameter("budgetId", event.pathParameters);
         response = await processGetBudget(userId, budgetId);
      }
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}