import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";
import { Recurrence } from "./recurrence";

export interface Income extends IEntity {
   userId: ObjectId;
   title: string;
   amount: number;
   occurrenceDate: Date;
   recurrence: Recurrence;
}