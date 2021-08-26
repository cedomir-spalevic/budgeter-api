import { BudgeterRequest } from "middleware/handler/lambda";
import { ChallengeConfirmationRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (
   request: BudgeterRequest
): ChallengeConfirmationRequest => {
   const { pathParameters, body } = request;   
   const input = { ...pathParameters, ...body };
   validator.validate(input, schema, { throwError: true });

   return { 
      key: pathParameters["key"] as string, 
      code: body["code"] as number
   };
};
