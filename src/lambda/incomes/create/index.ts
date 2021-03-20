import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import {
   isNumber,
   isOneOfStr,
   isStr,
   isValidJSONBody,
} from "middleware/validators";
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { processCreateIncome } from "./processor";

const validator = async (
   event: APIGatewayProxyEvent
): Promise<Partial<Income>> => {
   const userId = await isAuthorized(event);
   const form = isValidJSONBody(event.body);
   const title = isStr(form, "title", true);
   const amount = isNumber(form, "amount", true);
   const initialDay = isNumber(form, "initialDay", true);
   const initialDate = isNumber(form, "initialDate", true);
   const initialMonth = isNumber(form, "initialMonth", true);
   const initialYear = isNumber(form, "initialYear", true);
   const recurrence = isOneOfStr(
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
      recurrence,
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const incomeBody = await validator(event);
      const response = await processCreateIncome(incomeBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
