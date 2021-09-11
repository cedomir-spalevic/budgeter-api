import { ChallengeConfirmationRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = (
   request: BudgeterRequest
): ChallengeConfirmationRequest => {
   const { pathParameters, body } = request;
   const input = { ...pathParameters, ...body };
   runValidation(input, schema);

   return {
      key: pathParameters["key"] as string,
      code: body["code"] as number
   };
};
