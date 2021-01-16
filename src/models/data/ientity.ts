import { ObjectId } from "mongodb";

export interface IEntity {
   _id: ObjectId;
   modifiedOn: Date;
   createdOn: Date;
}