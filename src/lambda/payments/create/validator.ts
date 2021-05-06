import { Form } from "models/requests";
import {
   validateNumber,
   validateIsOneOfStr,
   validateStr,
   validateDayOfMonth,
   validateDayOfWeek,
   validateMonth,
   validateYear
} from "middleware/validators";
import { Payment } from "models/data/payment";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";
import { GeneralError } from "models/errors";

export const validate = (form: Form): Partial<Payment> => {
   const title = validateStr(form, "title", true);
   if (!title) throw new GeneralError("title is required");
   if (title.length > 100)
      throw new GeneralError("title exceeds the character limit of 100");
   const amount = validateNumber(form, "amount", true);
   const initialDay = validateDayOfWeek(form, "initialDay", true);
   const initialDate = validateDayOfMonth(form, "initialDate", true);
   const initialMonth = validateMonth(form, "initialMonth", true);
   const initialYear = validateYear(form, "initialYear", true);
   const recurrence = validateIsOneOfStr(
      form,
      "recurrence",
      recurrenceTypes,
      true
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
