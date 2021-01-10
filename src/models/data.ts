import { ObjectId } from "mongodb";

export interface User {
   firstName: string;
   lastName: string;
   email: string;
   isService: boolean;
   isAdmin: boolean;
   isEmailVerified: boolean;
   createdOn?: Date;
   modifiedOn?: Date;
   device?: {
      os: string;
      platformApplicationEndpointArn: string;
      subscriptionArn: string;
   }
}

export interface UserAuth {
   userId: ObjectId;
   hash: string;
}

export interface ConfirmationCode {
   userId: ObjectId;
   key: string;
   code: number;
}

export interface Budget {
   userId: ObjectId;
   name: string;
   startDate: Date;
   endDate: Date;
   completed: boolean;
   createdOn: Date;
   modifiedOn: Date;
   payments: BudgetPayment[];
}

export interface BudgetPayment {
   paymentId: ObjectId;
   completed: boolean;
}

export interface Payment {
   userId: ObjectId;
   name: string;
   amount: number;
   dueDate: Date;
   createdOn: Date;
   modifiedOn: Date;
}