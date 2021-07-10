import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import {
   APIGatewayProxyEventPathParameters,
   APIGatewayProxyEventQueryStringParameters
} from "aws-lambda";
import { GetUserRequest } from "./type";
import { BudgeterRequest } from "middleware/handler";

export const validate = (request: BudgeterRequest): GetUserRequest => {
   if (request.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(request.queryStrings);
      return {
         adminUserId: request.auth.userId,
         queryStrings
      };
   } else {
      const userId = getPathParameter("userId", request.pathParameters);
      return {
         adminUserId: request.auth.userId,
         userId
      };
   }
};
