import { ObjectId } from "mongodb";

export interface DeleteApiKeyRequest {
   apiKeyId: ObjectId;
}