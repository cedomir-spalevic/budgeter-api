import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { BudgeterRequest } from "middleware/handler";
import { GetIncomeRequest } from "./type";

export const validate = (request: BudgeterRequest): GetIncomeRequest => {
   const { auth: { userId } } = request;
   if (request.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(request.queryStrings);
      return {
         userId,
         queryStrings
      };
   }   
   const incomeId = getPathParameter("incomeId", request.pathParameters);
   return {
      userId,
      incomeId
   };
};
