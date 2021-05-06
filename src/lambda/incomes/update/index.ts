import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { processUpdateIncome } from "./processor";
import { validateForm, validatePathParameter } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const incomeId = validatePathParameter(event.pathParameters);
      const form = validateJSONBody(event.body);
      const partiallyUpdatedIncome = validateForm(form);
      partiallyUpdatedIncome._id = incomeId;
      partiallyUpdatedIncome.userId = userId;
      const response = await processUpdateIncome(partiallyUpdatedIncome);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
