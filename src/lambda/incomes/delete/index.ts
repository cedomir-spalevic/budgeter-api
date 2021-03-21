import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";
import { processDeleteIncome } from "./processor";

export interface DeleteIncomeBody {
   userId: ObjectId;
   incomeId: ObjectId;
}

const validator = async (
   event: APIGatewayProxyEvent
): Promise<DeleteIncomeBody> => {
   const userId = await isAuthorized(event);
   const incomeId = getPathParameter("incomeId", event.pathParameters);
   return { userId, incomeId };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const deleteIncomeBody = await validator(event);
      await processDeleteIncome(deleteIncomeBody);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
