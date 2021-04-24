import { isGuid, isNumber } from "middleware/validators";
import { Form } from "models/requests";

export interface ChallengeConfirmationBody {
   key: string;
   code: number;
}

export const validate = (
   key: string,
   form: Form
): ChallengeConfirmationBody => {
   key = isGuid(key);
   const code = isNumber(form, "code", true);

   return { key, code };
};
