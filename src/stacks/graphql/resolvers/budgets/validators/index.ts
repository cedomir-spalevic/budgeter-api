import { Validator } from "jsonschema";
import { GetBudgetQueryStringParameters } from "models/requests";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (
   args: Record<string, unknown>
): GetBudgetQueryStringParameters => {
   validator.validate(args, schema, { throwError: true });
   return {
      date: args["date"] as number,
      month: args["month"] as number,
      year: args["year"] as number
   };
};
