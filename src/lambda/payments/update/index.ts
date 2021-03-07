import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isDate, isNumber, isOneOfStr, isStr, isValidJSONBody } from "middleware/validators";
import { Payment } from "models/data/payment";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { processUpdatePayment } from "./processor";

const validator = async (event: APIGatewayProxyEvent): Promise<Partial<Payment>> => {
   const userId = await isAuthorized(event);
   const paymentId = getPathParameter("paymentId", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const title = isStr(form, "title");
   const amount = isNumber(form, "amount");
   const initialDay = isNumber(form, "initialDay");
   const initialDate = isNumber(form, "initialDate");
   const initialMonth = isNumber(form, "initialMonth");
   const initialYear = isNumber(form, "initialYear");
   const recurrence = isOneOfStr(form, "recurrence", recurrenceTypes) as Recurrence;

   return {
      _id: paymentId,
      userId,
      title,
      amount,
      initialDay,
      initialDate,
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
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*"
         }
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}