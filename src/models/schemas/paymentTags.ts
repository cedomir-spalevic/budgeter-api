import { IEntity } from "./ientity";

export interface PaymentTag extends IEntity {
   tag: string;
}

export interface PublicPaymentTag {
   id: string;
   tag: string;
   createdOn: Date;
   modifiedOn: Date;
}
