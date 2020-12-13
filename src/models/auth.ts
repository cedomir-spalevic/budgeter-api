import { ObjectId } from "mongodb";

export interface Token {
   issuedAt: number;
   userId: string;
}

export interface NewToken {
   issuedAt: number;
   userId: ObjectId;
}

export interface Device {
   userId?: string;
   device: string;
   platformApplicationEndpointArn: string;
   subscriptionArn: string;
}

export enum UserClaims {
   Admin,
   Service
}