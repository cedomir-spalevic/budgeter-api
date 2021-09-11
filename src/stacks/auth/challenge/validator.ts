import { OneTimeCodeType } from "models/schemas/oneTimeCode";
import { ChallengeRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = (request: BudgeterRequest): ChallengeRequest => {
   const { body } = request;
   runValidation(body, schema);

   return {
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      type: body["type"] as OneTimeCodeType
   };
};
