import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { getBudgetQueryStringParameters } from "middleware/url";
import { GetBudgetQueryStringParameters } from "models/requests";

export interface GetBudgetsBody {
   queryStrings: GetBudgetQueryStringParameters;
}

export const validate = (
   queryStringParameters: APIGatewayProxyEventQueryStringParameters
): GetBudgetsBody => {
   const queryStrings = getBudgetQueryStringParameters(queryStringParameters);
   return {
      queryStrings
   };
};
