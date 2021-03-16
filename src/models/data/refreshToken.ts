import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";

export interface RefreshToken extends IEntity {
   userId: ObjectId;
   token: string;
   expiresOn: number;
}
