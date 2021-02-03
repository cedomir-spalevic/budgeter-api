import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";
import { Recurrence } from "./recurrence";

export interface Payment extends IEntity {
   userId: ObjectId;
   title: string;
   amount: number;
   initialDay: number;
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
}

export interface PublicPayment {
   id: string;
   title: string
   amount: number;
   initialDay: number;
   initialMonth: number;
   initialYear: number;
   recurrence: Recurrence;
   createdOn: Date;
   modifiedOn: Date;
}