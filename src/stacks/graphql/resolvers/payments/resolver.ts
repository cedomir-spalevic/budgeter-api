import {
   BudgeterRequestAuth,
   GetListQueryStringParameters
} from "models/requests";
import { Payment, PublicPayment } from "models/schemas/payment";
import { Recurrence } from "models/schemas/recurrence";
import { ObjectId } from "mongodb";
import PaymentsProcessor from "./processor";

const resolvers = {
   payments: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment[]> => {
      const queryStringParameters: GetListQueryStringParameters = {
         skip: args["skip"] as number,
         limit: args["limit"] as number
      };
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return paymentsProcessor.get(queryStringParameters);
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
      const request: Partial<Payment> = {
         title: input["title"] as string,
         amount: input["amount"] as number,
         initialDay: input["initialDay"] as number,
         initialDate: input["initialDate"] as number,
         initialMonth: input["initialMonth"] as number,
         initialYear: input["initialYear"] as number,
         recurrence: input["recurrence"] as Recurrence
      };
      const paymentsProcessor = await PaymentsProcessor.getInstance(
         context.userId
      );
      return await paymentsProcessor.create(request);
   },
   updatePayment: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPayment> => {
      const paymentId = args["paymentId"] as string;
      const input = args["payment"] as Record<string, unknown>;
      const request: Partial<Payment> = {
         title: input["title"] as string,
         amount: input["amount"] as number,
         initialDay: input["initialDay"] as number,
         initialDate: input["initialDate"] as number,
         initialMonth: input["initialMonth"] as number,
         initialYear: input["initialYear"] as number,
         recurrence: input["recurrence"] as Recurrence
      };
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
