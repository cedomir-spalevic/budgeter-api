import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processCreateBudget } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const form = JSON.parse(event.body);
      const name = form["name"];
      const startDate = form["startDate"];
      const endDate = form["endDate"];

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