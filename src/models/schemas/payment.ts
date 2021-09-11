import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";
import { PaymentTag } from "./paymentTag";
import { Recurrence } from "./recurrence";

export interface Payment extends IEntity {
   userId: ObjectId;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   endDay?: number | null;
   endDate?: number | null;
   endMonth?: number | null;
   endYear?: number | null;
   recurrence: Recurrence;
   tags?: Partial<PaymentTag>[];
}

export interface PublicPayment {
   id: string;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   endDay: number | null;
   endDate: number | null;
   endMonth: number | null;
   endYear: number | null;
   recurrence: Recurrence;
   createdOn: Date;
   modifiedOn: Date;
   tags?: Partial<PaymentTag>[];
}
