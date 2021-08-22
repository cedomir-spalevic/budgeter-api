import { BudgeterRequest } from "middleware/handler";
import { getPathParameter } from "middleware/url";
import { DeleteUserRequest } from "../../../../admin/users/delete/type";

export const validate = (request: BudgeterRequest): DeleteUserRequest => {
   const userId = getPathParameter("userId", request.pathParameters);
   return {
      adminUserId: request.auth.userId,
      userId
   };
};
