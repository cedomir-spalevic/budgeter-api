export interface User {
   userId: string;
   email: string;
}

export interface BudgetPayment {
   budgetPaymentId?: string;
   budgetId: string;
   paymentId: string;
   completed: boolean;
}

export interface Budget {
   budgetId?: string;
   name: string;
   startDate: number;
   endDate: number;
   completed: boolean;
   payments?: BudgetPayment[];
}

export interface Payment {
   paymentId?: string;
   name: string;
   amount: number;
   dueDate: number;
   budgets?: string[];
}