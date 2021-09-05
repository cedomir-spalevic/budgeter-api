import { BudgeterRequestAuth } from "models/requests";
import { PublicPayment } from "models/schemas/payment";
import { ObjectId } from "mongodb";
import PaymentsProcessor from "./processor";
import { validate as validateGet } from "../../utils/validators/get";
import { validate as validateCreate } from "./validators/create";
import { validate as validateUpdate } from "./validators/update";

const resolvers = {
   payments: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment[]> => {
      const filters = validateGet(args);
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return paymentsProcessor.get(filters);
   },
   paymentById: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const id = args["id"] as string;
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return paymentsProcessor.getById(new ObjectId(id));
   },
   createPayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const input = args["payment"] as Record<string, unknown>;
      const request = await validateCreate(input);
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return await paymentsProcessor.create(request);
   },
   updatePayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const id = args["id"] as string;
      const input = args["payment"] as Record<string, unknown>;
      const request = await validateUpdate(input);
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      await paymentsProcessor.update(new ObjectId(id), request);
      return await paymentsProcessor.getById(new ObjectId(id));
   },
   deletePayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      const id = args["id"] as string;
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      await paymentsProcessor.delete(new ObjectId(id));
      return new ObjectId(id);
   }
};

export default resolvers;
