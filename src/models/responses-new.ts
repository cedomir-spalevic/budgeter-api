import { WithId } from "mongodb";
import { User } from "./data-new";

export interface AuthResponse {
   token: string;
   user: WithId<User>;
}