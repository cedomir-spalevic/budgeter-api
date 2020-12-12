import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { PaymentResponse } from "models/responses";
import PaymentsService from "services/external/db/payments";

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

   const paymentResponse: PaymentResponse = {
      valid: false
   };
   let dueDate: number, hasError = false;

   const requestFormBody = JSON.parse(event.body);
   const name = requestFormBody["name"];
   const amount = requestFormBody["amount"];
   const postedDueDate = requestFormBody["dueDate"];

   if (!name) {
      paymentResponse.nameError = "Name is required";
      hasError = true;
   }
   if (!amount) {
      paymentResponse.amountError = "Amount is required";
      hasError = true;
   }
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

   // Create payment
   try {
      const paymentsService = new PaymentsService(userId);
      const payment = await paymentsService.create(name, amount, dueDate);
      paymentResponse.valid = true;
      paymentResponse.paymentId = payment.paymentId;
      return {
         statusCode: 201,
         body: JSON.stringify(paymentResponse)
      }
   }
   catch (error) {
      paymentResponse.totalError = "Unable to create payment"
      return {
         statusCode: 400,
         body: JSON.stringify(paymentResponse)
      };
   }
}