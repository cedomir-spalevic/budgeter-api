import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { validateJSONBody } from "middleware/validators";
import { processUpdatePayment } from "./processor";
import { validateForm, validatePathParameter } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const paymentId = validatePathParameter(event.pathParameters);
      const form = validateJSONBody(event.body);
      const partiallyUpdatedPayment = validateForm(form);
      partiallyUpdatedPayment._id = paymentId;
      partiallyUpdatedPayment.userId = userId;
      const response = await processUpdatePayment(partiallyUpdatedPayment);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
