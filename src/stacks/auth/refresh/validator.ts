import { RefreshRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";

const validator = new Validator();

export const validate = (request: BudgeterRequest): RefreshRequest => {
   const { body } = request;
   validator.validate(body, schema, { throwError: true });
   return {
      refreshToken: body["refreshToken"] as string
   };
};
