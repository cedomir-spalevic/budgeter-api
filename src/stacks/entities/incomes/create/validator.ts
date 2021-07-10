import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateDayOfMonth,
   validateDayOfWeek,
   validateMonth,
   validateYear
} from "middleware/validators";
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { GeneralError } from "models/errors";
import { BudgeterRequest } from "middleware/handler";

export const validate = (request: BudgeterRequest): Partial<Income> => {
   const { auth: { userId }, body } = request;
   const title = validateStr(body, "title", true);
   if (!title) throw new GeneralError("title is required");
   if (title.length > 100)
      throw new GeneralError("title exceeds the character limit of 100");
   const amount = validateNumber(body, "amount", true);
   const initialDay = validateDayOfWeek(body, "initialDay", true);
   const initialDate = validateDayOfMonth(body, "initialDate", true);
   const initialMonth = validateMonth(body, "initialMonth", true);
   const initialYear = validateYear(body, "initialYear", true);
   const recurrence = validateIsOneOfStr(
      body,
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
