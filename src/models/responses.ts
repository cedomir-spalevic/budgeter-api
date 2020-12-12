import { WithId } from "mongodb";
import { User } from "./data-new";

export interface AuthResponse {
   valid: boolean;
   user?: WithId<User>;
   token?: string;
   emailError?: string;
   passwordError?: string;
   totalError?: string;
}

export interface BudgetResponse {
   valid: boolean;
   budgetId?: string;
   nameError?: string;
   startDateError?: string;
   endDateError?: string;
   totalError?: string;
}

export interface PaymentResponse {
   valid: boolean;
   paymentId?: string;
   nameError?: string;
   amountError?: string;
   dueDateError?: string;
   totalError?: string;
}