import { ObjectId } from "mongodb";
import { Recurrence } from "./recurrence";

export type BudgetType = "income" | "payment";

export class IBudgetItem {
   userId: ObjectId;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
}

export interface PublicBudgetItem {
   id: string;
   title: string; 
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
   createdOn: Date;
   modifiedOn: Date;
}

export interface PublicBudgetItemWithInfo extends PublicBudgetItem {
   dueToday: boolean;
   numberOfOccurrences: number;
   totalAmount: number;
}
