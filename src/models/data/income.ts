import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";
import { Recurrence } from "./recurrence";

export interface Income extends IEntity {
   userId: ObjectId;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
}

export interface PublicIncome {
   id: string;
   title: string
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
   createdOn: Date;
   modifiedOn: Date;
}

export interface BudgetIncome extends PublicIncome {
   dueToday: boolean;
   totalAmount: number;
}