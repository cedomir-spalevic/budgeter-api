import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { isDate, isStr, isValidJSONBody } from "middleware/validators";
import { processCreateBudget } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const form = isValidJSONBody(event.body);
      const name = isStr(form, "name", true);
      const startDate = isDate(form, "startDate", true);
      const endDate = isDate(form, "endDate", true);

      const response = await processCreateBudget(userId, name, startDate, endDate);
      return {
         statusCode: 201,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}