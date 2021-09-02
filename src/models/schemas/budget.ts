import { PublicIncome } from "./income";
import { PublicPayment } from "./payment";

export interface PublicBudgetIncome extends PublicIncome {
   dueToday: boolean;
   numberOfOccurrences: number;
   totalAmount: number;
}

export interface PublicBudgetPayment extends PublicPayment {
   dueToday: boolean;
   numberOfOccurrences: number;
   totalAmount: number;
}

export interface Budget {
   incomes: PublicBudgetIncome[];
   payments: PublicBudgetPayment[];
}

export enum BudgetTypeValue {
   Income = "income",
   Payment = "payment"
}
