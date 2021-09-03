import { UnauthorizedError } from "models/errors";
import { BudgeterRequestAuth } from "models/requests";

export const graphqlAdminAuth = (context: BudgeterRequestAuth): void => {
   if (!context.isAdmin) throw new UnauthorizedError();
};
