import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";

export const validate = (
   queryStringParameters: APIGatewayProxyEventQueryStringParameters
): ObjectId => {
   return getPathParameter("incomeId", queryStringParameters);
};
