import { BudgeterRequest } from "middleware/handler";
import { getPathParameter } from "middleware/url";
import { DeleteUserRequest } from "./type";

export const validate = (request: BudgeterRequest): DeleteUserRequest => {
   const userId = getPathParameter("userId", request.pathParameters);
   return {
      adminUserId: request.auth.userId,
      userId
   };
};
