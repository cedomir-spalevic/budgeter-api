import { PublicBudgetItemWithInfo } from "models/data/budgetItem";

export interface ConfirmationResponse {
   expires: number;
   key: string;
}

export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
   expires: number;
}

export interface GetResponse<T> {
   count: number;
   values: T[];
}

export interface GetBudgetResponse {
   incomes: PublicBudgetItemWithInfo[];
   payments: PublicBudgetItemWithInfo[];
}
