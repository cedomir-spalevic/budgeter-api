import { BudgeterRequestAuth, GetBudgetQueryStringParameters } from "models/requests";
import { Budget } from "models/schemas/budget";
import { getIncomes, getPayments } from "./processor";

const resolvers = {
   getBudget: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<Budget> => {  
      const queryParams: GetBudgetQueryStringParameters = {         
         date: args["date"] as number,
         month: args["month"] as number,
         year: args["year"] as number
      }
      const response = await Promise.all([
         await getIncomes(queryParams, context),
         await getPayments(queryParams, context)
      ]);

      return {
         incomes: response[0],
         payments: response[1]
      };
   }
}

export default resolvers;