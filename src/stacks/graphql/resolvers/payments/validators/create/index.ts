import { Validator } from "jsonschema";
import { Payment } from "models/schemas/payment";
import { Recurrence } from "models/schemas/recurrence";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (
   request: Record<string, unknown>
): Partial<Payment> => {
   validator.validate(request, schema, { throwError: true });
   return {
      title: request["title"] as string,
      amount: request["amount"] as number,
      initialDay: request["initialDay"] as number,
      initialDate: request["initialDate"] as number,
      initialMonth: request["initialMonth"] as number,
      initialYear: request["initialYear"] as number,
      recurrence: request["recurrence"] as Recurrence
   };
};
