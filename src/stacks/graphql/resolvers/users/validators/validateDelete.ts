import { getPathParameter } from "middleware/url";
import { BudgeterRequest } from "models/requests";

export const validate = (request: BudgeterRequest): any => {
   const userId = getPathParameter("userId", request.pathParameters);
   return {
      adminUserId: request.auth.userId,
      userId
   };
};
