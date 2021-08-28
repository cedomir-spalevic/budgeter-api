import { OneTimeCodeType } from "models/schemas/oneTimeCode";
import { ChallengeRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";

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
