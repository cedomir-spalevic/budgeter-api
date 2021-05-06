import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { PublicBudgetItem } from "models/data/budgetItem";
import { GetResponse } from "models/responses";
import { processGetMany, processGetSingle } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const getIncomesBody = await validate({
         queryStrings: event.queryStringParameters,
         pathParameters: event.pathParameters
      });
      let response: GetResponse<PublicBudgetItem> | PublicBudgetItem;
      if (getIncomesBody.queryStrings)
         response = await processGetMany(userId, getIncomesBody.queryStrings);
      else
         response = await processGetSingle(
            userId,
            getIncomesBody.pathParameters.incomeId
         );
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
