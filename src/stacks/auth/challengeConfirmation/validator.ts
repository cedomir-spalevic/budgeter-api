import { BudgeterRequest } from "middleware/handler";
import { getPathParameterId } from "middleware/url";
import { validateGuid, validateNumber } from "middleware/validators";
import { ChallengeConfirmationRequest } from "./type";

export const validate = (
   request: BudgeterRequest
): ChallengeConfirmationRequest => {
   const { pathParameters, body } = request;
   const pathKey = getPathParameterId("key", pathParameters);
   const key = validateGuid(pathKey);
   const code = validateNumber(body, "code", true);

   return { key, code };
};
