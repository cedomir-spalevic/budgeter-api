import { validateGuid, validateNumber } from "middleware/validators";
import { Form } from "models/requests";

export interface ChallengeConfirmationRequest {
   key: string;
   form: Form;
}

export interface ChallengeConfirmationBody {
   key: string;
   code: number;
}

export const validate = (
   request: ChallengeConfirmationRequest
): ChallengeConfirmationBody => {
   const key = validateGuid(request.key);
   const code = validateNumber(request.form, "code", true);

   return { key, code };
};
