import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { BudgeterRequest } from "middleware/handler/lambda";
import { GetIncomeRequest } from "../../../../entities/incomes/get/type";

export const validate = (request: BudgeterRequest): GetIncomeRequest => {
   const {
      auth: { userId }
   } = request;
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
