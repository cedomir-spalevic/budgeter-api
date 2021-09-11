import { BudgeterRequestAuth } from "models/requests";
import { PaymentTag, PublicPaymentTag } from "models/schemas/paymentTag";
import { ObjectId } from "mongodb";
import { graphqlAdminAuth } from "stacks/graphql/utils/auth";
import PaymentTagsProcessor from "./processor";
import { validate as validateGet } from "../../utils/validators/get";

// Admin access only
const resolvers = {
   paymentTags: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPaymentTag[]> => {
      graphqlAdminAuth(context);
      console.log("here");
      const filters = validateGet(args);
      const paymentTagsProcessor = await PaymentTagsProcessor.getInstance();
      return paymentTagsProcessor.get(filters);
   },
   createPaymentTag: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicPaymentTag> => {
      graphqlAdminAuth(context);
      const paymentTagInput = args["paymentTag"] as Partial<PaymentTag>;
      const paymentTagsProcessor = await PaymentTagsProcessor.getInstance();
      return paymentTagsProcessor.create(paymentTagInput);
   },
   deletePaymentTag: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      graphqlAdminAuth(context);
      const id = args["id"] as string;
      const paymentTagsProcessor = await PaymentTagsProcessor.getInstance();
      await paymentTagsProcessor.delete(new ObjectId(id));
      return new ObjectId(id);
   }
};

export default resolvers;
