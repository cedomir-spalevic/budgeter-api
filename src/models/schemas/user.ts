import { IEntity } from "./ientity";

export interface User extends IEntity {
   firstName: string;
   lastName: string;
   email: string | null;
   phoneNumber: string | null;
   isAdmin: boolean;
   isMfaVerified: boolean;
   device?: {
      os: string;
      platformApplicationEndpointArn: string;
      subscriptionArn: string;
   };
   notificationPreferences: {
      incomeNotifications: boolean;
      paymentNotifications: boolean;
   };
}

export interface PublicUser {
   firstName: string;
   lastName: string;
   email: string;
   phoneNumber: string;
   isMfaVerified: boolean;
   createdOn: Date;
   modifiedOn: Date;
   device: {
      os: string | null;
   };
   notificationPreferences: {
      incomeNotifications: boolean;
      paymentNotifications: boolean;
   };
}

export interface AdminPublicUser extends PublicUser {
   id: string;
   isAdmin: boolean;
}
