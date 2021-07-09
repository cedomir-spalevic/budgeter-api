import { BudgeterRequest } from "middleware/handler";
import { validateStr } from "middleware/validators";

export interface RefreshBody {
   refreshToken: string;
}

export const validate = (request: BudgeterRequest): RefreshBody => {
   const { body } = request;
   const refreshToken = validateStr(body, "refreshToken", true);
   return { refreshToken };
};
