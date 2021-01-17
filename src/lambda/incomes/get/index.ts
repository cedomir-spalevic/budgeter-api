import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter, getQueryStringParameters, QueryStringParameters } from "middleware/url";
import { ObjectId } from "mongodb";
import { processGetMany, processGetSingle } from "./processor";

export interface GetIncomesBody {
   userId: ObjectId;
   queryStrings?: QueryStringParameters,
   pathParameters?: { incomeId: ObjectId }
}

const validator = async (event: APIGatewayProxyEvent): Promise<GetIncomesBody> => {
   const userId = await isAuthorized(event);
   if (event.pathParameters === null) {
      const queryStrings = getQueryStringParameters(event.queryStringParameters);
      return {
         userId,
         queryStrings
      }
   }
   else {
      const incomeId = getPathParameter("incomeId", event.pathParameters);
      return {
         userId,
         pathParameters: {
            incomeId
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
         response = await processGetSingle(getIncomesBody.userId, getIncomesBody.pathParameters.incomeId)
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}