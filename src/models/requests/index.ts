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