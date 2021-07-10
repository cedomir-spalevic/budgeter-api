import { ObjectId } from "mongodb";

export interface DeleteIncomeRequest {
   userId: ObjectId;
   incomeId: ObjectId;
}
