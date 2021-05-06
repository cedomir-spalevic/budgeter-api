import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";

export const validate = (
   pathParameters: APIGatewayProxyEventPathParameters
): ObjectId => {
   return getPathParameter("apiKeyId", pathParameters);
};
