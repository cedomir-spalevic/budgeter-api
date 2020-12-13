import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { isDate, isNumber, isStr, isValidJSONBody } from "middleware/validators";
import { processCreatePayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      const form = isValidJSONBody(event.body);
      const name = isStr(form, "name", true);
      const amount = isNumber(form, "amount", true);
      const dueDate = isDate(form, "dueDate", true);

      const response = await processCreatePayment(userId, name, amount, dueDate);
      return {
         statusCode: 201,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}