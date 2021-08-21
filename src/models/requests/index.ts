import { ObjectId } from "mongodb";

export interface Form {
   [name: string]: Record<string, unknown> | string | number | boolean | null | undefined;
}

export interface GetListQueryStringParameters {
   limit: number;
   skip: number;
   search?: string;
}

export interface GetBudgetQueryStringParameters {
   date: number;
   month: number;
   year: number;
}

export interface AdminUserRequest {
   userId?: ObjectId;
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   isAdmin: boolean;
   password: string;
}

export interface StepFunctionBatchJobRequest {
   Payload: {
      Input: {
         apiKey: string;
      };
   };
}
