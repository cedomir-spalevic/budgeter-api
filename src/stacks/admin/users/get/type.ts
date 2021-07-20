import { AdminPublicUser } from "models/schemas/user";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";

export interface GetUserRequest {
   adminUserId: ObjectId;
   userId?: ObjectId;
   queryStrings?: GetListQueryStringParameters;
}

export type GetUserResponse = Promise<
   GetResponse<AdminPublicUser> | AdminPublicUser
>;
