import { DeleteApiKeyRequest } from "./type";
import { BudgeterRequest } from "middleware/handler";
import { validatePathParameterId } from "middleware/url";

export const validate = (
   request: BudgeterRequest
): DeleteApiKeyRequest => {
   const { pathParameters } = request;
   const apiKeyId = validatePathParameterId("apiKeyId", pathParameters);
   return { apiKeyId };
};
