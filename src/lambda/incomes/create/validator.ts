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
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";

export const validate = (form: Form): Partial<Income> => {
   const title = validateStr(form, "title", true);
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
