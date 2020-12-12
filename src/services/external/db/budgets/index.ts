import { query as Query, Client } from "faunadb";
import { Result, ResultSet } from "models/db";
import { v4 as uuidv4 } from "uuid";
import { Budget } from "models/data";

export default class BudgetsService {
   private userId: string;
   private singularIndex: string;
   private pluralIndex: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor(userId: string) {
      this.userId = userId;
      this.singularIndex = "userBudget"
      this.pluralIndex = "userBudgets";
      this.resource = "budgets";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Get all budgets for user
    */
   private async getAllRefs(): Promise<ResultSet<Budget>> {
      return await this.faunaDbClient.query<ResultSet<Budget>>(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.pluralIndex), [this.userId])),
            Query.Lambda(x => Query.Get(x))
         )
      );
   }

   /**
    * Get budgets for a user
    */
   public async get(): Promise<Budget[]> {
      const result = await this.getAllRefs();
      return result.data.map(x => x.data);
   }

   /**
    * Create a new budget
    * @param name
    * @param startDate
    * @param endDate
    */
   public async create(name: string, startDate: number, endDate: number): Promise<Budget> {
      const budget: Budget = {
         budgetId: uuidv4(),
         name,
         startDate,
         endDate,
         completed: false,
         createdOn: new Date().toISOString(),
         modifiedOn: new Date().toISOString()
      }
      const request = {
         data: {
            userId: this.userId,
            ...budget
         }
      }
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         request
      ));
      return budget;
   }

   /**
    * Update a budget
    * @param budgetId 
    * @param updatedBudget 
    */
   public async update(budgetId: string, updatedBudget: any): Promise<void> {
      updatedBudget.modifiedOn = new Date().toISOString();
      const result = await this.getRef(budgetId);
      await this.faunaDbClient.query(Query.Update(
         Query.Ref(result.ref.collection, result.ref.id),
         { data: { ...updatedBudget } }
      ));
   }

   /**
    * Delete all budgets for this user
    */
   public async deleteAllBudgets(): Promise<void> {
      const result = await this.getAllRefs();
      await Promise.all(result.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )));
   }

   /**
    * Delete a budget
    * @param budgetId 
    */
   public async delete(budgetId: string): Promise<void> {
      const result = await this.getRef(budgetId);
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }

   /**
    * Get a Budgets reference
    * @param budgetId 
    */
   private async getRef(budgetId: string): Promise<Result<Budget>> {
      return await this.faunaDbClient.query<Result<Budget>>(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId])
      ));
   }
}