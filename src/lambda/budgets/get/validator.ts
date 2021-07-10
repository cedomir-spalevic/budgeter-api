import { BudgeterRequest } from "middleware/handler";
import { getBudgetQueryStringParameters } from "middleware/url";
import { GetBudgetsRequest } from "./type";



export const validate = (
   request: BudgeterRequest
): GetBudgetsRequest => {
   const queryStrings = getBudgetQueryStringParameters(request.queryStrings);
   return {
      userId: request.auth.userId,
      queryStrings
   };
};
