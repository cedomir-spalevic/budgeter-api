
import { BudgeterRequestAuth, GetListQueryStringParameters } from "models/requests";
import { Income, PublicIncome } from "models/schemas/income";
import { Recurrence } from "models/schemas/recurrence";
import { ObjectId } from "mongodb";
import IncomesProcessor from "./processor";

const resolvers = {
   incomes: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicIncome[]> => {
      const queryStringParameters: GetListQueryStringParameters = {
         skip: args["skip"] as number,
         limit: args["limit"] as number
      }
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return incomesProcessor.get(queryStringParameters);
   },
   incomeById: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicIncome> => {
      const incomeId = args["incomeId"] as string;
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return incomesProcessor.getById(new ObjectId(incomeId));
   },
   createIncome: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicIncome> => {
      const input = args["income"] as Record<string, unknown>;
      const request: Partial<Income> = {
         title: input["title"] as string,
         amount: input["amount"] as number,
         initialDay: input["initialDay"] as number,
         initialDate: input["initialDate"] as number,
         initialMonth: input["initialMonth"] as number,
         initialYear: input["initialYear"] as number,
         recurrence: input["recurrence"] as Recurrence
      }
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return await incomesProcessor.create(request);
   },
   updateIncome: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<PublicIncome> => {
      const incomeId = args["incomeId"] as string;
      const input = args["income"] as Record<string, unknown>;
      const request: Partial<Income> = {
         title: input["title"] as string,
         amount: input["amount"] as number,
         initialDay: input["initialDay"] as number,
         initialDate: input["initialDate"] as number,
         initialMonth: input["initialMonth"] as number,
         initialYear: input["initialYear"] as number,
         recurrence: input["recurrence"] as Recurrence
      }
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      return await incomesProcessor.update(new ObjectId(incomeId), request);
   },
   deleteIncome: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<ObjectId> => {
      const incomeId = args["incomeId"] as string;
      const incomesProcessor = await IncomesProcessor.getInstance(context.userId);
      await incomesProcessor.delete(new ObjectId(incomeId));
      return new ObjectId(incomeId);
   }
}

export default resolvers;