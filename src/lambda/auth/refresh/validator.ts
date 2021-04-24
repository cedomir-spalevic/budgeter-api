import { validateStr } from "middleware/validators";
import { Form } from "models/requests";

export interface RefreshBody {
   refreshToken: string;
}

export const validate = (form: Form): RefreshBody => {
   const refreshToken = validateStr(form, "refreshToken", true);
   return { refreshToken };
};
