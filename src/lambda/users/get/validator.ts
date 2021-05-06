import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import {
   APIGatewayProxyEventPathParameters,
   APIGatewayProxyEventQueryStringParameters
} from "aws-lambda";

export interface GetUsersBody {
   queryStrings?: GetListQueryStringParameters;
   pathParameters?: { userId: ObjectId };
}

interface Input {
   queryStrings: APIGatewayProxyEventQueryStringParameters;
   pathParameters: APIGatewayProxyEventPathParameters;
}

export const validate = (input: Input): GetUsersBody => {
   if (input.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(input.queryStrings);
      return {
         queryStrings
      };
   } else {
      const userId = getPathParameter("userId", input.pathParameters);
      return {
         pathParameters: {
            userId
         }
      };
   }
};
