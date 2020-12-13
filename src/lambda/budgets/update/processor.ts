import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";

export const processUpdateBudget = async (userId: ObjectId, budgetId: ObjectId, name: any, startDate: any, endDate: any, completed: any) => {
   // Check if name, start date and end date are valid
   if (!name)
      throw new GeneralError("Name cannot be blank");
   if (!startDate)
      throw new GeneralError("Start Date cannot be blank");
   if (!endDate)
      throw new GeneralError("End Date cannot be blank");
}


// if (postedStartDate) {
//    startDate = Date.parse(postedStartDate);
//    if (isNaN(startDate)) {
//       budgetResponse.startDateError = "Invalid start date";
//       hasError = true;
//    }
// }
// if (postedEndDate) {
//    endDate = Date.parse(postedEndDate);
//    if (isNaN(endDate)) {
//       budgetResponse.endDateError = "Invalid end date";
//       hasError = true;
//    }
// }

// if (hasError) {
//    return {
//       statusCode: 400,
//       body: JSON.stringify(budgetResponse)
//    }
// }

// // Update budget
// try {
//    const updatedBudget = { name, completed, startDate, endDate };
//    const budgetsService = new BudgetsService(userId);
//    await budgetsService.update(budgetId, updatedBudget);
//    budgetResponse.valid = true;
//    budgetResponse.budgetId = budgetId;
//    return {
//       statusCode: 201,
//       body: JSON.stringify(budgetResponse)
//    }
// }
// catch (error) {
//    budgetResponse.totalError = "Unable to update budget";
//    return {
//       statusCode: 400,
//       body: JSON.stringify(budgetResponse)
//    };
// }