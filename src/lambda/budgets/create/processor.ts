import { Budget } from "models/data-new";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processCreateBudget = async (userId: ObjectId, name: any, startDate: any, endDate: any): Promise<Budget> => {
   // Check if name, start date and end date are valid
   if (!name)
      throw new GeneralError("Name cannot be blank");
   if (!startDate)
      throw new GeneralError("Start Date cannot be blank");
   if (!endDate)
      throw new GeneralError("End Date cannot be blank");

   const budgetsService = await BudgetsService.getInstance(userId);
   const budget = await budgetsService.create(name, startDate, endDate);
   return budget;
}