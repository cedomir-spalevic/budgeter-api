import { BudgeterRequestAuth } from "models/requests";
import { Budget } from "models/schemas/budget";
import { validate } from "./validators";
import { getIncomes, getPayments } from "./processor";

const resolvers = {
   budget: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<Budget> => {
      const queryParams = validate(args);
      const { 0: incomes, 1: payments } = await Promise.all([
         await getIncomes(queryParams, context),
         await getPayments(queryParams, context)
      ]);

      return {
         incomes,
         payments
      };
   }
};

export default resolvers;
