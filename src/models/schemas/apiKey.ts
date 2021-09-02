import { IEntity } from "./ientity";

export interface ApiKey extends IEntity {
   key: string;
}

export interface PublicApiKey {
   id: string;
   key: string;
}
