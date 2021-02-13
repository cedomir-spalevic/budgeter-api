import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isDate, isNumber, isOneOfStr, isStr, isValidJSONBody } from "middleware/validators";
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { processUpdateIncome } from "./processor";

const validator = async (event: APIGatewayProxyEvent): Promise<Partial<Income>> => {
   const userId = await isAuthorized(event);
   const incomeId = getPathParameter("incomeId", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const title = isStr(form, "title");
   const amount = isNumber(form, "amount");
   const initialDay = isNumber(form, "initialDay");
   const initialDate = isNumber(form, "initialDate");
   const initialMonth = isNumber(form, "initialMonth");
   const initialYear = isNumber(form, "initialYear");
   const recurrence = isOneOfStr(form, "recurrence", recurrenceTypes) as Recurrence;

   return {
      _id: incomeId,
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
      const incomeBody = await validator(event);
      const response = await processUpdateIncome(incomeBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}