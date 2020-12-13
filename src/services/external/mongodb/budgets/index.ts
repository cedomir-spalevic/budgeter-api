import { Budget } from "models/data-new";
import { Collection, ObjectId, WithId } from "mongodb";
import Client from "../client";

/**
 * Service that communicates with the Budgets collection
 */
class BudgetsService {
   protected userId: ObjectId;
   protected collection: Collection<Budget>;
   static instance: BudgetsService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(id: ObjectId): Promise<BudgetsService> {
      if (!BudgetsService.instance) {
         BudgetsService.instance = new BudgetsService();
         const client = await Client.getInstance();
         BudgetsService.instance.collection = client.db("budgeter").collection<Budget>("budgets");
      }
      BudgetsService.instance.userId = id;
      return BudgetsService.instance;
   }

   public async create(name: string, startDate: Date, endDate: Date): Promise<WithId<Budget>> {
      const currentDate = new Date();
      const budget: Budget = {
         userId: this.userId,
         name,
         startDate,
         endDate,
         completed: false,
         createdOn: currentDate,
         modifiedOn: currentDate,
         payments: []
      };
      const response = await this.collection.insertOne(budget);
      return response.ops[0];
   }

   public async update(updatedBudget: WithId<Budget>): Promise<void> {
      const currentBudget = await this.getById(updatedBudget._id);
      if (currentBudget === null)
         return;
      let wasModified = false;
      if (updatedBudget.name !== currentBudget.name) {
         currentBudget.name = updatedBudget.name;
         wasModified = true;
      }
      if (updatedBudget.startDate !== updatedBudget.startDate) {
         currentBudget.startDate = updatedBudget.startDate;
         wasModified = true;
      }
      if (updatedBudget.endDate !== updatedBudget.endDate) {
         currentBudget.endDate = updatedBudget.endDate;
         wasModified = true;
      }
      if (wasModified) {
         currentBudget.modifiedOn = new Date();
         await this.collection.replaceOne({ _id: currentBudget._id }, currentBudget);
      }
   }

   public async deleteAll(): Promise<void> {
      await this.collection.deleteMany({ userId: this.userId });
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }

   public async getById(id: ObjectId): Promise<WithId<Budget> | null> {
      return await this.collection.findOne({ _id: id });
   }

   public async get(limit: number, skip: number): Promise<WithId<Budget>[]> {
      const response = await this.collection.find<WithId<Budget>>({}, { limit, skip });
      const items: WithId<Budget>[] = [];
      response.forEach(x => items.push(x));
      return items;
   }

   public async addPayment(budgetId: ObjectId, paymentId: ObjectId): Promise<void> {
      const budget = await this.getById(budgetId);
      if (budget === null)
         return;
      budget.payments.push({ paymentId, completed: false });
      await this.collection.replaceOne({ _id: budgetId }, budget);
   }

   public async removePayment(budgetId: ObjectId, paymentId: ObjectId): Promise<void> {
      const budget = await this.getById(budgetId);
      if (budget === null)
         return;
      const paymentIndex = budget.payments.findIndex(x => x.paymentId === paymentId);
      if (paymentIndex === -1)
         return;
      budget.payments.splice(paymentIndex, 1);
      await this.collection.replaceOne({ _id: budgetId }, budget);
   }

   public async updatePayment(budgetId: ObjectId, paymentId: ObjectId, completed: boolean): Promise<void> {
      const budget = await this.getById(budgetId);
      if (budget === null)
         return;
      const paymentIndex = budget.payments.findIndex(x => x.paymentId === paymentId);
      if (paymentIndex === -1)
         return;
      budget.payments[paymentIndex].completed = completed;
      await this.collection.replaceOne({ _id: budgetId }, budget);
   }

   public async exists(budgetId: ObjectId): Promise<boolean> {
      const count = await this.collection.countDocuments({ _id: budgetId, userId: this.userId });
      return count === 1;
   }
}

export default {
   getInstance: (userId: ObjectId) => BudgetsService.getInstance(userId)
}