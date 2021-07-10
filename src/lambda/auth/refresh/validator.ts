import { BudgeterRequest } from "middleware/handler";
import { validateStr } from "middleware/validators";
import { RefreshRequest } from "./type";

export const validate = (request: BudgeterRequest): RefreshRequest => {
   const { body } = request;
   const refreshToken = validateStr(body, "refreshToken", true);
   return { refreshToken };
};
