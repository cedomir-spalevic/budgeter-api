import { ObjectId } from "mongodb";

export interface DeletePaymentRequest {
   userId: ObjectId;
   paymentId: ObjectId;
}
