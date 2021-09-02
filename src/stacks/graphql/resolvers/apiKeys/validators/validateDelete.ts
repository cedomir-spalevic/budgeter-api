import { validatePathParameterId } from "middleware/url";
import { ObjectId } from "mongodb";

interface DeleteApiKeyRequest {
   apiKeyId: ObjectId;
}

export const validateDelete = (
   args: Record<string, unknown>
): DeleteApiKeyRequest => {
   const apiKeyId = validatePathParameterId("apiKeyId", args);
   return { apiKeyId };
};
