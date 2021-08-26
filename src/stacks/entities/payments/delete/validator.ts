import { BudgeterRequest } from "middleware/handler/lambda";
import { getPathParameter } from "middleware/url";
import { DeletePaymentRequest } from "./type";

export const validate = (request: BudgeterRequest): DeletePaymentRequest => {
   const paymentId = getPathParameter("paymentId", request.pathParameters);
   return {
      userId: request.auth.userId,
      paymentId
   };
};
