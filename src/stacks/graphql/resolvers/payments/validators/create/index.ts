import { Validator } from "jsonschema";
import { Payment } from "models/schemas/payment";
import { PaymentTag, PublicPaymentTag } from "models/schemas/paymentTag";
import { Recurrence } from "models/schemas/recurrence";
import { ObjectId } from "mongodb";
import PaymentTagsProcessor from "../../../paymentTags/processor";
import schema from "./schema.json";

const validator = new Validator();

export const validate = async (
   request: Record<string, unknown>
): Promise<Partial<Payment>> => {
   validator.validate(request, schema, { throwError: true });
   const tags = request["tags"] as ObjectId[];
   let paymentTags: Partial<PaymentTag>[] = [];
   if (tags) {
      const paymentTagsProcessor = await PaymentTagsProcessor.getInstance();
      const allPaymentTags = await Promise.all(
         tags.map((id) => paymentTagsProcessor.getById(new ObjectId(id)))
      );
      paymentTags = allPaymentTags.map(
         (tag: PublicPaymentTag): Partial<PaymentTag> => ({
            _id: new ObjectId(tag.id)
         })
      );
   }
   return {
      title: request["title"] as string,
      amount: request["amount"] as number,
      initialDay: request["initialDay"] as number,
      initialDate: request["initialDate"] as number,
      initialMonth: request["initialMonth"] as number,
      initialYear: request["initialYear"] as number,
      endDay: (request["endDay"] as number) ?? null,
      endDate: (request["endDate"] as number) ?? null,
      endMonth: (request["endMonth"] as number) ?? null,
      endYear: (request["endYear"] as number) ?? null,
      recurrence: request["recurrence"] as Recurrence,
      tags: paymentTags
   };
};
