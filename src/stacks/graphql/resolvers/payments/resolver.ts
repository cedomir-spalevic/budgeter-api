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
      const paymentId = args["paymentId"] as string;
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return paymentsProcessor.getById(new ObjectId(paymentId));
   },
   createPayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const input = args["income"] as Record<string, unknown>;
      const request = validateCreate(input);
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return await paymentsProcessor.create(request);
   },
   updatePayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const paymentId = args["id"] as string;
      const input = args["payment"] as Record<string, unknown>;
      const request = validateUpdate(input);
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return await paymentsProcessor.update(new ObjectId(paymentId), request);
   },
   deletePayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      const paymentId = args["paymentId"] as string;
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      await paymentsProcessor.delete(new ObjectId(paymentId));
      return new ObjectId(paymentId);
   }
};

export default resolvers;
