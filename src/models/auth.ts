import { ObjectId } from "mongodb";

export interface Token {
   issuedAt: number;
   userId: ObjectId;
}

export enum UserClaims {
   Admin,
   Service
}