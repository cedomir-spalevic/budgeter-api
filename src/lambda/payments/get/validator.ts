import { getListQueryStringParameters, getPathParameter } from "middleware/url";
import { GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import {
   APIGatewayProxyEventPathParameters,
   APIGatewayProxyEventQueryStringParameters
} from "aws-lambda";

export interface GetPaymentsBody {
   queryStrings?: GetListQueryStringParameters;
   pathParameters?: { paymentId: ObjectId };
}

interface Input {
   queryStrings: APIGatewayProxyEventQueryStringParameters;
   pathParameters: APIGatewayProxyEventPathParameters;
}

export const validate = (input: Input): GetPaymentsBody => {
   if (input.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(input.queryStrings);
      return {
         queryStrings
      };
   } else {
      const paymentId = getPathParameter("paymentId", input.pathParameters);
      return {
         pathParameters: {
            paymentId
         }
      };
   }
};
