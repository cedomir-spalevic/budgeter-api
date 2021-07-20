import { BudgeterRequest } from "middleware/handler";
import { validatePathParameterId } from "middleware/url";
import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateDayOfWeek,
   validateDayOfMonth,
   validateMonth,
   validateYear
} from "middleware/validators";
import { Payment } from "models/schemas/payment";
import { Recurrence, recurrenceTypes } from "models/schemas/recurrence";
import { GeneralError } from "models/errors";

export const validate = (request: BudgeterRequest): Partial<Payment> => {
   const {
      auth: { userId },
      body
   } = request;
   const paymentId = validatePathParameterId(
      "paymentId",
      request.pathParameters
   );
   let title = validateStr(body, "title");
   if (title === "" || title === null) title = undefined;
   if (title && title.length > 100)
      throw new GeneralError("title exceeds the character limit of 100");
   const amount = validateNumber(body, "amount");
   const initialDay = validateDayOfWeek(body, "initialDay");
   const initialDate = validateDayOfMonth(body, "initialDate");
   const initialMonth = validateMonth(body, "initialMonth");
   const initialYear = validateYear(body, "initialYear");
   const recurrence = validateIsOneOfStr(
      body,
      "recurrence",
      recurrenceTypes
   ) as Recurrence;

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
   };
};
