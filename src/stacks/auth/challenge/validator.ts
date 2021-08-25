import { OneTimeCodeType } from "models/schemas/oneTimeCode";
import { BudgeterRequest } from "middleware/handler";
import { ChallengeRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (request: BudgeterRequest): ChallengeRequest => {
   const { body } = request;
   validator.validate(body, schema, { throwError: true });

   return {
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      type: body["type"] as OneTimeCodeType
   };
};
