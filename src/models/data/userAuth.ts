import { ObjectId } from "bson";
import { IEntity } from "./ientity";

export interface UserAuth extends IEntity {
   userId: ObjectId;
   hash: string;
}