import { PublicBudgetItem } from "models/schemas/budget";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";

export interface GetPaymentRequest {
   userId: ObjectId;
   paymentId?: ObjectId;
   queryStrings?: GetListQueryStringParameters;
}

export type GetPaymentResponse = Promise<
   GetResponse<PublicBudgetItem> | PublicBudgetItem
>;
