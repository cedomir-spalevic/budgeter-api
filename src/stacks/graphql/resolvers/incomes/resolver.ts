import { BudgeterRequestAuth } from "models/requests";
import { PublicIncome } from "models/schemas/income";
import { ObjectId } from "mongodb";
import IncomesProcessor from "./processor";
import { validate as validateGet } from "../../utils/validators/get";
import { validate as validateCreate } from "./validators/create";
import { validate as validateUpdate } from "./validators/update";

const resolvers = {
   incomes: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicIncome[]> => {
      const filters = validateGet(args);
      const incomesProcessor = await IncomesProcessor.getInstance(
         context.userId
      );
      return incomesProcessor.get(filters);
   },
   incomeById: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicIncome> => {
      const incomeId = args["id"] as string;
      const incomesProcessor = await IncomesProcessor.getInstance(
         context.userId
      );
      return incomesProcessor.getById(new ObjectId(incomeId));
   },
   createIncome: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicIncome> => {
      const input = args["income"] as Record<string, unknown>;
      const request = validateCreate(input);
      const incomesProcessor = await IncomesProcessor.getInstance(
         context.userId
      );
      return await incomesProcessor.create(request);
   },
   updateIncome: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicIncome> => {
      const incomeId = args["id"] as string;
      const input = args["income"] as Record<string, unknown>;
      const request = validateUpdate(input);
      const incomesProcessor = await IncomesProcessor.getInstance(
         context.userId
      );
      return await incomesProcessor.update(new ObjectId(incomeId), request);
   },
   deleteIncome: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      const incomeId = args["id"] as string;
      const incomesProcessor = await IncomesProcessor.getInstance(
         context.userId
      );
      await incomesProcessor.delete(new ObjectId(incomeId));
      return new ObjectId(incomeId);
   }
};

export default resolvers;
