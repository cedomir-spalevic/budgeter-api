import { IEntity } from "./ientity";

export interface APIKey extends IEntity {
   key: string;
}

export interface PublicAPIKey {
   id: string;
   key: string;
}
