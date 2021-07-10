import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { BudgeterRequest } from "middleware/handler";
import { GetPaymentRequest } from "./type";

export const validate = (request: BudgeterRequest): GetPaymentRequest => {
   const {
      auth: { userId }
   } = request;
   if (request.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(request.queryStrings);
      return {
         userId,
         queryStrings
      };
   } else {
      const paymentId = getPathParameter("paymentId", request.pathParameters);
      return {
         userId,
         paymentId
      };
   }
};
