import { BudgeterRequest } from "middleware/handler";
import { getPathParameterId } from "middleware/url";
import { validateGuid, validateNumber } from "middleware/validators";

export interface ChallengeConfirmationBody {
   key: string;
   code: number;
}

export const validate = (
   request: BudgeterRequest
): ChallengeConfirmationBody => {
   const { pathParameters, body } = request;
   const pathKey = getPathParameterId("key", pathParameters);
   const key = validateGuid(pathKey);
   const code = validateNumber(body, "code", true);

   return { key, code };
};
