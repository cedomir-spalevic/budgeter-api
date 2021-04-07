import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";
import { processDeletePayment } from "./processor";

export interface DeletePaymentBody {
   userId: ObjectId;
   paymentId: ObjectId;
}

const validate = async (
   event: APIGatewayProxyEvent
): Promise<DeletePaymentBody> => {
   const userId = await isAuthorized(event);
   const paymentId = getPathParameter("paymentId", event.pathParameters);
   return { userId, paymentId };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const deletePaymentBody = await validate(event);
      await processDeletePayment(deletePaymentBody);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
