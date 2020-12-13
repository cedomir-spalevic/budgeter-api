import { Budget } from "models/data";
import { GeneralError } from "models/errors";
import { ObjectId } from "mongodb";
import BudgetsService from "services/external/mongodb/budgets";

export const processCreateBudget = async (userId: ObjectId, name: string, startDate: Date, endDate: Date): Promise<Budget> => {
   // Check if name, start date and end date are valid
   if (!name)
      throw new GeneralError("Name cannot be blank");

   const budgetsService = await BudgetsService.getInstance(userId);
   return await budgetsService.create(name, startDate, endDate);
}