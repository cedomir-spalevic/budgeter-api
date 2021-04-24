import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateJSONBody
} from "middleware/validators";
import { Payment } from "models/data/payment";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { processCreatePayment } from "./processor";

const validate = async (
   event: APIGatewayProxyEvent
): Promise<Partial<Payment>> => {
   const userId = await isAuthorized(event);
   const form = validateJSONBody(event.body);
   const title = validateStr(form, "title", true);
   const amount = validateNumber(form, "amount", true);
   const initialDay = validateNumber(form, "initialDay", true);
   const initialDate = validateNumber(form, "initialDate", true);
   const initialMonth = validateNumber(form, "initialMonth", true);
   const initialYear = validateNumber(form, "initialYear", true);
   const recurrence = validateIsOneOfStr(
      form,
      "recurrence",
      recurrenceTypes,
      true
   ) as Recurrence;

   return {
      userId,
      title,
      amount,
      initialDay,
      initialDate,
      initialMonth,
      initialYear,
      recurrence
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const paymentBody = await validate(event);
      const response = await processCreatePayment(paymentBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
