import { BudgeterRequest } from "middleware/handler/lambda";
import { getPathParameter } from "middleware/url";
import { DeleteIncomeRequest } from "./type";

export const validate = (request: BudgeterRequest): DeleteIncomeRequest => {
   const incomeId = getPathParameter("incomeId", request.pathParameters);
   return {
      userId: request.auth.userId,
      incomeId
   };
};
