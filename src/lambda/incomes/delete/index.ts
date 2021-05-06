import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processDeleteIncome } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const incomeId = await validate(event.pathParameters);
      await processDeleteIncome(userId, incomeId);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
