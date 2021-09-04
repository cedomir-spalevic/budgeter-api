import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";
import { PaymentTag } from "./paymentTags";
import { Recurrence } from "./recurrence";

export interface Payment extends IEntity {
   userId: ObjectId;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
   paymentTags?: PaymentTag[];
}

export interface PublicPayment {
   id: string;
   title: string;
   amount: number;
   initialDay: number; // Day of week
   initialDate: number; // Day of month
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
   createdOn: Date;
   modifiedOn: Date;
   paymentTags?: PaymentTag[];
}
