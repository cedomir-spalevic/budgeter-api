import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isDate, isNumber, isStr, isValidJSONBody } from "middleware/validators";
import { processUpdatePayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const paymentId = getPathParameter("paymentId", event.pathParameters);
      const form = isValidJSONBody(event.body);
      const name = isStr(form, "name");
      const amount = isNumber(form, "amount");
      const dueDate = isDate(form, "dueDate");

      const response = await processUpdatePayment(userId, paymentId, name, amount, dueDate);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}