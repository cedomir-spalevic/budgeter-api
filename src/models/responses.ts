import { User } from "./data";

export interface AuthResponse {
   valid: boolean;
   user?: User;
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