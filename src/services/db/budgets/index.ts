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
    * Get budgets for a user
    */
   public async get(): Promise<Budget[]> {
      const response = await this.faunaDbClient.query(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.pluralIndex), [this.userId])),
            Query.Lambda(x => Query.Get(x))
         )
      ) as ResultSet<any>;
      return response.data.map(x => ({
         budgetId: x.data.budgetId,
         name: x.data.name,
         startDate: x.data.startDate,
         endDate: x.data.endDate,
         completed: x.data.completed
      }))
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
         completed: false
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
      const response = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId])
      )) as Result<Budget>;
      await this.faunaDbClient.query(Query.Update(
         Query.Ref(response.ref.collection, response.ref.id),
         { data: { ...updatedBudget } }
      ));
   }

   /**
    * Delete a budget
    * @param budgetId 
    */
   public async delete(budgetId: string): Promise<void> {
      const result: any = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId])
      ));
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }
}