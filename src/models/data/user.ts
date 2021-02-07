import { IEntity } from "./ientity";

export interface User extends IEntity {
   firstName: string;
   lastName: string;
   email: string;
   isService: boolean;
   isAdmin: boolean;
   isEmailVerified: boolean;
   device?: {
      os: string;
      platformApplicationEndpointArn: string;
      subscriptionArn: string;
   },
   notificationPreferences: {
      incomeNotifications: boolean;
      paymentNotifications: boolean;
   }
}

export interface PublicUser {
   firstName: string;
   lastName: string;
   email: string;
   emailVerified: boolean;
   createdOn: Date;
   modifiedOn: Date;
   device: {
      os: string | null;
   },
   notificationPreferences: {
      incomeNotifications: boolean;
      paymentNotifications: boolean;
   }
}
