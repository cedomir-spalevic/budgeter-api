import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import {
   APIGatewayProxyEventPathParameters,
   APIGatewayProxyEventQueryStringParameters
} from "aws-lambda";

export interface GetIncomesBody {
   queryStrings?: GetListQueryStringParameters;
   pathParameters?: { incomeId: ObjectId };
}

interface Input {
   queryStrings: APIGatewayProxyEventQueryStringParameters;
   pathParameters: APIGatewayProxyEventPathParameters;
}

export const validate = (input: Input): GetIncomesBody => {
   if (input.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(input.queryStrings);
      return {
         queryStrings
      };
   } else {
      const incomeId = getPathParameter("incomeId", input.pathParameters);
      return {
         pathParameters: {
            incomeId
         }
      };
   }
};
