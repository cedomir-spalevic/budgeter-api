import BudgeterMongoClient from "services/external/mongodb/client";
import { PublicBudgetItem } from "models/schemas/budgetItem";
import { Income } from "models/schemas/income";
import UserBudgetCachingStrategy from "services/internal/caching/budgets";
import { ObjectId, WithId } from "mongodb";
import { NotFoundError } from "models/errors";
import { BudgeterEntityCollection } from "services/external/mongodb/entityCollection";

class IncomeProcessor {
   static instance: IncomeProcessor;
   private _userId: ObjectId;
   private _collection: BudgeterEntityCollection<Income>;
   private _allowedFieldsToUpdate: (keyof WithId<Income>)[] = [
      "title",
      "amount",
      "initialDay",
      "initialDate",
      "initialMonth",
      "initialYear",
      "recurrence"
   ];

   constructor(userId: ObjectId) {
      this._userId = userId;
   }

   private async connect(): Promise<void> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      this._collection = budgeterClient.getIncomesCollection();
   }

   static async getInstance(userId: ObjectId): Promise<IncomeProcessor> {
      if(!IncomeProcessor.instance) {
         IncomeProcessor.instance = new IncomeProcessor(userId);
         await IncomeProcessor.instance.connect();
      }
      return IncomeProcessor.instance;
   }

   private transformResponse(income: Income): PublicBudgetItem {
      return {
         id: income._id.toHexString(),
         title: income.title,
         amount: income.amount,
         initialDay: income.initialDay,
         initialDate: income.initialDate,
         initialMonth: income.initialMonth,
         initialYear: income.initialYear,
         recurrence: income.recurrence,
         createdOn: income.createdOn,
         modifiedOn: income.modifiedOn
      }
   }

   public async create(request: Partial<Income>): Promise<PublicBudgetItem> {
      const income = await this._collection.create(request);
   
      const cachingStrategy = new UserBudgetCachingStrategy("income");
      cachingStrategy.delete(income.userId);
   
      return this.transformResponse(income);
   }

   public async delete(incomeId: ObjectId): Promise<void> {
      const income = await this._collection.find({
         userId: this._userId,
         _id: incomeId
      });
      if (!income) throw new NotFoundError("No Income found with the given Id");

      const cachingStrategy = new UserBudgetCachingStrategy("income");
      cachingStrategy.delete(this._userId);

      await this._collection.delete(incomeId);
   }

   public async update(incomeId: ObjectId, request: Partial<Income>): Promise<PublicBudgetItem> {
      const existingIncome = await this._collection.find({
         userId: this._userId,
         _id: incomeId
      });
      if (!existingIncome) throw new NotFoundError("No Income found with the given Id");
      
      // We only want to update the income with the differences. Not replace
      this._allowedFieldsToUpdate.forEach((field: keyof WithId<Income>) => {
         if (
            request[field] !== undefined &&
            existingIncome[field] !== request[field]
         )
            existingIncome[field] = request[field];
      });

      const updatedIncome = await this._collection.update(existingIncome);

      const cachingStrategy = new UserBudgetCachingStrategy("income");
      cachingStrategy.delete(existingIncome.userId);

      return this.transformResponse(updatedIncome);
   }
}

export default {
   getInstance: IncomeProcessor.getInstance
}