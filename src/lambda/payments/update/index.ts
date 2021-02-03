import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isDate, isNumber, isOneOfStr, isStr, isValidJSONBody } from "middleware/validators";
import { Payment } from "models/data/payment";
import { Recurrence } from "models/data/recurrence";
import { processUpdatePayment } from "./processor";

const validator = async (event: APIGatewayProxyEvent): Promise<Partial<Payment>> => {
   const userId = await isAuthorized(event);
   const paymentId = getPathParameter("paymentId", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const title = isStr(form, "title", true);
   const amount = isNumber(form, "amount", true);
   const initialDay = isNumber(form, "initialDay", true);
   const initialMonth = isNumber(form, "initialMonth", true);
   const initialYear = isNumber(form, "initialYear", true);
   const recurrence = isOneOfStr(form, "recurrence", ["daily", "weekly", "biweekly", "monthly", "yearly"], true) as Recurrence;

   return {
      _id: paymentId,
      userId,
      title,
      amount,
      initialDay,
      initialMonth,
      initialYear,
      recurrence
   }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const paymentBody = await validator(event);
      const response = await processUpdatePayment(paymentBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}