import { Form } from "models/requests";
import {
   isNumber,
   isOneOfStr,
   isStr,
   isValidDayOfMonth,
   isValidDayOfWeek,
   isValidMonth,
   isValidYear
} from "middleware/validators";
import { Income } from "models/data/income";
import { Recurrence, recurrenceTypes } from "models/data/recurrence";

export const validate = (
   form: Form
): Partial<Income> => {
   const title = isStr(form, "title", true);
   const amount = isNumber(form, "amount", true);
   const initialDay = isValidDayOfWeek(form, "initialDay", true);
   const initialDate = isValidDayOfMonth(form, "initialDate", true);
   const initialMonth = isValidMonth(form, "initialMonth", true);
   const initialYear = isValidYear(form, "initialYear", true);
   const recurrence = isOneOfStr(
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