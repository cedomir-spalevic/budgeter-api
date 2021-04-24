import { validateGuid, validateNumber } from "middleware/validators";
import { Form } from "models/requests";

export interface ChallengeConfirmationBody {
   key: string;
   code: number;
}

export const validate = (
   key: string,
   form: Form
): ChallengeConfirmationBody => {
   key = validateGuid(key);
   const code = validateNumber(form, "code", true);

   return { key, code };
};
