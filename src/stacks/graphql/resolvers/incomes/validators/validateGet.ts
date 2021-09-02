import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { BudgeterRequest } from "models/requests";

export const validate = (request: BudgeterRequest): any => {
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
