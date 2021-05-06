import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { getPathParameter } from "middleware/url";
import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateDayOfWeek,
   validateDayOfMonth,
   validateMonth,
   validateYear
} from "middleware/validators";
import { Payment } from "models/data/payment";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { GeneralError } from "models/errors";
import { Form } from "models/requests";
import { ObjectId } from "mongodb";

export const validatePathParameter = (
   pathParameters: APIGatewayProxyEventPathParameters
): ObjectId => {
   return getPathParameter("paymentId", pathParameters);
};

export const validateForm = (form: Form): Partial<Payment> => {
   let title = validateStr(form, "title");
   if (title === "" || title === null) title = undefined;
   if (title && title.length > 100)
      throw new GeneralError("title exceeds the character limit of 100");
   const amount = validateNumber(form, "amount");
   const initialDay = validateDayOfWeek(form, "initialDay");
   const initialDate = validateDayOfMonth(form, "initialDate");
   const initialMonth = validateMonth(form, "initialMonth");
   const initialYear = validateYear(form, "initialYear");
   const recurrence = validateIsOneOfStr(
      form,
      "recurrence",
      recurrenceTypes
   ) as Recurrence;

   return {
      title,
      amount,
      initialDay,
      initialDate,
      initialMonth,
      initialYear,
      recurrence
   };
};
