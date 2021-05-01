import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateJSONBody
} from "middleware/validators";
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { processUpdateIncome } from "./processor";

const validate = async (
   event: APIGatewayProxyEvent
): Promise<Partial<Income>> => {
   const userId = await isAuthorized(event);
   const incomeId = getPathParameter("incomeId", event.pathParameters);
   const form = validateJSONBody(event.body);
   const title = validateStr(form, "title");
   const amount = validateNumber(form, "amount");
   const initialDay = validateNumber(form, "initialDay");
   const initialDate = validateNumber(form, "initialDate");
   const initialMonth = validateNumber(form, "initialMonth");
   const initialYear = validateNumber(form, "initialYear");
   const recurrence = validateIsOneOfStr(
      form,
      "recurrence",
      recurrenceTypes
   ) as Recurrence;

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
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const partiallyUpdatedIncome = await validate(event);
      const response = await processUpdateIncome(partiallyUpdatedIncome);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
