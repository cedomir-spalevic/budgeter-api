export interface GetListQueryStringParameters {
   limit: number;
   skip: number;
   search?: string;
}

export interface GetBudgetQueryStringParameters {
   day: number;
   month: number;
   year: number;
}