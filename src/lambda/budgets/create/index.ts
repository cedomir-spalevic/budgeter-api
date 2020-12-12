import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { BudgetResponse } from "models/responses";
import BudgetsService from "services/external/db/budgets";

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

   const budgetResponse: BudgetResponse = {
      valid: false
   };
   let startDate: number, endDate: number, hasError = false;

   const requestFormBody = JSON.parse(event.body);
   const name = requestFormBody["name"];
   const postedStartDate = requestFormBody["startDate"];
   const postedEndDate = requestFormBody["endDate"];

   if (!name) {
      budgetResponse.nameError = "Name is required";
      hasError = true;
   }
   if (!postedStartDate) {
      budgetResponse.startDateError = "Start date is required";
      hasError = true;
   }
   else {
      startDate = Date.parse(postedStartDate);
      if (isNaN(startDate)) {
         budgetResponse.startDateError = "Invalid start date";
         hasError = true;
      }
   }
   if (!postedEndDate) {
      budgetResponse.endDateError = "End date is required";
      hasError = true;
   }
   else {
      endDate = Date.parse(postedEndDate);
      if (isNaN(endDate)) {
         budgetResponse.endDateError = "Invalid end date";
         hasError = true;
      }
   }

   if (hasError) {
      return {
         statusCode: 400,
         body: JSON.stringify(budgetResponse)
      }
   }

   // Create budget
   try {
      const budgetsService = new BudgetsService(userId);
      const budget = await budgetsService.create(name, startDate, endDate);
      budgetResponse.valid = true;
      budgetResponse.budgetId = budget.budgetId;
      return {
         statusCode: 201,
         body: JSON.stringify(budgetResponse)
      }
   }
   catch (error) {
      budgetResponse.totalError = "Unable to create budget"
      return {
         statusCode: 400,
         body: JSON.stringify(budgetResponse)
      };
   }
}