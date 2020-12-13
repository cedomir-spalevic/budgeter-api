import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorizedNew } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import { processAddPayment } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userId = await isAuthorizedNew(event);
      const budgetId = getPathParameter("budgetId", event.pathParameters);
      const form = JSON.parse(event.body);
      const paymentId = form["paymentId"];
      if (!paymentId || ObjectId.isValid(paymentId))
         throw new GeneralError("Payment Id is not valid");

      await processAddPayment(userId, budgetId, new ObjectId(paymentId));
      return {
         statusCode: 201,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}