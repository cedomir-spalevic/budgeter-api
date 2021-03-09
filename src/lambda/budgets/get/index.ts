import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getBudgetQueryStringParameters } from "middleware/url";
import { GetBudgetQueryStringParameters } from "models/requests";
import { ObjectId } from "mongodb";
import { getBudget } from "./processor";

export interface GetBudgetsBody {
   userId: ObjectId;
   queryStrings: GetBudgetQueryStringParameters;
}

const validator = async (
   event: APIGatewayProxyEvent
): Promise<GetBudgetsBody> => {
   const userId = await isAuthorized(event);
   const queryStrings = getBudgetQueryStringParameters(
      event.queryStringParameters
   );
   return {
      userId,
      queryStrings,
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const getBudgetsBody = await validator(event);
      const response = await getBudget(getBudgetsBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
