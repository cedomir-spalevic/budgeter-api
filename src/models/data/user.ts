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
   }
}
