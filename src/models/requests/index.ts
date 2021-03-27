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
   firstName: string;
   lastName: string;
   email?: string;
   isAdmin: boolean;
   password: string;
}

export interface StepFunctionBatchJobRequest {
   Input: {
      apiKey: string;
   };
}
