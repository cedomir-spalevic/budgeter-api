import { PublicIncome } from "./income";
import { PublicPayment } from "./payment";

interface PublicBudgetIncome extends PublicIncome {
   dueToday: boolean;
   numberOfOccurrences: number;
   totalAmount: number;
}

interface PublicBudgetPayment extends PublicPayment {
   dueToday: boolean;
   numberOfOccurrences: number;
   totalAmount: number;
}

export interface Budget {
   incomes: PublicBudgetIncome[];
   payments: PublicBudgetPayment[];
}

export type BudgetType = "income" | "payment";
