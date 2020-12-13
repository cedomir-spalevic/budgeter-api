import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isBool, isDate, isStr, isValidJSONBody } from "middleware/validators";
import { processUpdateBudget } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);
      const form = isValidJSONBody(event.body);
      const name = isStr(form, "name");
      const startDate = isDate(form, "startDate");
      const endDate = isDate(form, "endDate");
      const completed = isBool(form, "completed");

      const response = await processUpdateBudget(userId, budgetId, name, startDate, endDate, completed);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}