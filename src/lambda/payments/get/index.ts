import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter, getListQueryStringParameters } from "middleware/url";
import { GetListQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import { processGetMany, processGetSingle } from "./processor";

export interface GetPaymentsBody {
   userId: ObjectId;
   queryStrings?: GetListQueryStringParameters,
   pathParameters?: { paymentId: ObjectId }
}

const validator = async (event: APIGatewayProxyEvent): Promise<GetPaymentsBody> => {
   const userId = await isAuthorized(event);
   if (event.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(event.queryStringParameters);
      return {
         userId,
         queryStrings
      }
   }
   else {
      const paymentId = getPathParameter("paymentId", event.pathParameters);
      return {
         userId,
         pathParameters: {
            paymentId
         }
      }
   }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const getIncomesBody = await validator(event);
      let response: any;
      if (getIncomesBody.queryStrings)
         response = await processGetMany(getIncomesBody.userId, getIncomesBody.queryStrings);
      else
         response = await processGetSingle(getIncomesBody.userId, getIncomesBody.pathParameters.paymentId)
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}