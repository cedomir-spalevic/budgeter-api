import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { PaymentResponse } from "models/responses";
import PaymentsService from "services/db/payments";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   let userId: string;
   try {
      userId = await isAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   const paymentId = event.pathParameters["paymentId"];
   if (!paymentId) {
      return {
         statusCode: 400,
         body: "Payment Id is invalid"
      };
   }

   const paymentResponse: PaymentResponse = {
      valid: false
   };
   let dueDate: number, hasError = false;

   const requestFormBody = JSON.parse(event.body);
   const name = requestFormBody["name"];
   const amount = requestFormBody["amount"];
   const postedDueDate = requestFormBody["dueDate"];
   if (postedDueDate) {
      dueDate = Date.parse(postedDueDate);
      if (isNaN(dueDate)) {
         paymentResponse.dueDateError = "Invalid due date";
         hasError = true;
      }
   }

   if (hasError) {
      return {
         statusCode: 400,
         body: JSON.stringify(paymentResponse)
      }
   }

   // Update payment
   try {
      const updatedPayment = { name, amount, dueDate };
      const paymentsService = new PaymentsService(userId);
      await paymentsService.update(paymentId, updatedPayment);
      paymentResponse.valid = true;
      paymentResponse.paymentId = paymentId;
      return {
         statusCode: 200,
         body: JSON.stringify(paymentResponse)
      }
   }
   catch (error) {
      paymentResponse.totalError = "Unable to update payment"
      return {
         statusCode: 400,
         body: JSON.stringify(paymentResponse)
      };
   }
}