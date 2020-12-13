import { BudgetClaims } from "models/auth";
import { Budget } from "models/data-new";
import { Collection, ObjectId, WithId } from "mongodb";
import { convertDateToUTCDate, getUTCDateObj } from "services/internal/datetime";
import Client from "../client";

/**
 * Service that communicates with the Budgets collection
 */
class BudgetsService {
   protected collection: Collection<Budget>;
   static instance: BudgetsService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(): Promise<BudgetsService> {
      if (!BudgetsService.instance) {
         BudgetsService.instance = new BudgetsService();
         const client = await Client.getInstance();
         BudgetsService.instance.collection = client.db("budgeter").collection<Budget>("budgets");
      }
      return BudgetsService.instance;
   }

   public async create(name: string, startDate: Date, endDate: Date): Promise<WithId<Budget>> {
      const currentDate = getUTCDateObj();
      const budget: Budget = {
         name,
         startDate: convertDateToUTCDate(startDate),
         endDate: convertDateToUTCDate(endDate),
         completed: false,
         createdOn: currentDate,
         modifiedOn: currentDate,
         payments: []
      };
      const response = await this.collection.insertOne(budget);
      return response.ops[0];
   }

   public async update(Budget: WithId<Budget>): Promise<void> {
      const currentDate = getUTCDateObj();
      Budget.modifiedOn = currentDate;
      await this.collection.replaceOne({ _id: Budget._id }, Budget);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }

   public async findBudgetByEmail(email: string): Promise<WithId<Budget> | null> {
      return await this.collection.findOne({ email });
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
}

export default {
   getInstance: () => BudgetsService.getInstance()
}