import { WithId } from "mongodb";
import { User } from "./data";

export interface AuthResponse {
   token: string;
   user: WithId<User>;
}