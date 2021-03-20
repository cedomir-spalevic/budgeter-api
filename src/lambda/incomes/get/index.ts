import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter, getListQueryStringParameters } from "middleware/url";
import { PublicIncome } from "models/data/income";
import { GetListQueryStringParameters } from "models/requests";
import { GetResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { processGetMany, processGetSingle } from "./processor";

export interface GetIncomesBody {
   userId: ObjectId;
   queryStrings?: GetListQueryStringParameters;
   pathParameters?: { incomeId: ObjectId };
}

const validator = async (
   event: APIGatewayProxyEvent
): Promise<GetIncomesBody> => {
   const userId = await isAuthorized(event);
   if (event.pathParameters === null) {
      const queryStrings = getListQueryStringParameters(
         event.queryStringParameters
      );
      return {
         userId,
         queryStrings,
      };
   } else {
      const incomeId = getPathParameter("incomeId", event.pathParameters);
      return {
         userId,
         pathParameters: {
            incomeId,
         },
      };
   }
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const getIncomesBody = await validator(event);
      let response: GetResponse<PublicIncome> | PublicIncome;
      if (getIncomesBody.queryStrings)
         response = await processGetMany(
            getIncomesBody.userId,
            getIncomesBody.queryStrings
         );
      else
         response = await processGetSingle(
            getIncomesBody.userId,
            getIncomesBody.pathParameters.incomeId
         );
      return {
         statusCode: 200,
         body: JSON.stringify(response),
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
