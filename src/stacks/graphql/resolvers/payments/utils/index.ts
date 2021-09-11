import { Payment, PublicPayment } from "models/schemas/payment";
import { WithId } from "mongodb";
import { transformResponse as transformPaymentTags } from "../../paymentTags/utils";

export const transformResponse = (payment: WithId<Payment>): PublicPayment => ({
   id: payment._id.toHexString(),
   title: payment.title,
   amount: payment.amount,
   initialDay: payment.initialDay,
   initialDate: payment.initialDate,
   initialMonth: payment.initialMonth,
   initialYear: payment.initialYear,
   recurrence: payment.recurrence,
   endDay: payment.endDay,
   endDate: payment.endDate,
   endMonth: payment.endMonth,
   endYear: payment.endYear,
   createdOn: payment.createdOn,
   modifiedOn: payment.modifiedOn,
   tags: payment.tags ? payment.tags.map(transformPaymentTags) : []
});
