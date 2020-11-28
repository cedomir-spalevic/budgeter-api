export interface User {
   userId: string;
   email: string;
   isService: boolean;
   isAdmin: boolean;
   createdOn?: string; // In ISO String
   modifiedOn?: string; // In ISO String
}

export interface BudgetPayment {
   budgetPaymentId?: string;
   budgetId: string;
   paymentId: string;
   completed: boolean;
   createdOn?: string; // In ISO String
   modifiedOn?: string; // In ISO String
}

export interface Budget {
   budgetId?: string;
   name: string;
   startDate: number;
   endDate: number;
   completed: boolean;
   payments?: BudgetPayment[];
   createdOn?: string; // In ISO String
   modifiedOn?: string; // In ISO String
}

export interface Payment {
   paymentId?: string;
   name: string;
   amount: number;
   dueDate: number;
   budgets?: string[];
   createdOn?: string; // In ISO String
   modifiedOn?: string; // In ISO String
}