import { ObjectId } from "mongodb";

export interface DeleteUserRequest {
   adminUserId: ObjectId;
   userId: ObjectId;
}
