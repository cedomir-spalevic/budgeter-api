import { BudgeterRequest } from "middleware/handler";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";

export const validate = (
   request: BudgeterRequest
): ObjectId => {
   const { pathParameters } = request;
   return getPathParameter("apiKeyId", pathParameters);
};
