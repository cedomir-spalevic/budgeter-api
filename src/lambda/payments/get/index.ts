import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter, getQueryStringParameters } from "middleware/url";
import { processGetPayment, processGetPayments } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorized(event);
      let response;
      if (event.pathParameters === null) {
         const queryStrings = getQueryStringParameters(event.queryStringParameters);
         response = await processGetPayments(userId, queryStrings.limit, queryStrings.skip);
      }
      else {
         const paymentId = getPathParameter("paymentId", event.pathParameters);
         response = await processGetPayment(userId, paymentId);
      }
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}