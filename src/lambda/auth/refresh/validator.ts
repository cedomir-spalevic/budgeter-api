import { isStr } from "middleware/validators";
import { Form } from "models/requests";

export interface RefreshBody {
   refreshToken: string;
}

export const validate = (form: Form): RefreshBody => {
   const refreshToken = isStr(form, "refreshToken", true);
   return { refreshToken };
};