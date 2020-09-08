import { query as Query, Client } from "faunadb";
import { Result, ResultSet } from "models/db";
import { BudgetPayment } from "models/data";
import { v4 as uuidv4 } from "uuid";

export default class BudgetPaymentsService {
   private userId: string;
   private singularIndex: string;
   private budgetPluralIndex: string;
   private paymentPluralIndex: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor(userId: string) {
      this.userId = userId;
      this.singularIndex = "userBudgetPayment"
      this.budgetPluralIndex = "userBudgetPayments";
      this.paymentPluralIndex = "userBudgetsWithPayment";
      this.resource = "budgetPayments";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Remove payment from a budget
    * @param paymentId 
    */
   public async removePaymentFromBudgets(paymentId: string): Promise<void> {
      const result: ResultSet<any> = await this.faunaDbClient.query(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.paymentPluralIndex), [this.userId, paymentId])),
            Query.Lambda(x => Query.Get(x))
         )
      )
      await Promise.all(result.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )))
   }

   /**
    * Delete all payments in a budget
    * @param budgetId 
    */
   public async deleteAll(budgetId: string): Promise<void> {
      const response = await this.faunaDbClient.query(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.budgetPluralIndex), [this.userId, budgetId])),
            Query.Lambda(x => Query.Get(x))
         )
      ) as ResultSet<any>;
      await Promise.all(response.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )))
   }

   /**
    * Get all payments for a budget
    * @param budgetId 
    */
   public async getAll(budgetId: string): Promise<BudgetPayment[]> {
      const response = await this.faunaDbClient.query(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.budgetPluralIndex), [this.userId, budgetId])),
            Query.Lambda(x => Query.Get(x))
         )
      ) as ResultSet<any>;
      return response.data.map(x => ({
         budgetPaymentId: x.data.budgetPaymentId,
         budgetId: x.data.budgetId,
         paymentId: x.data.paymentId,
         completed: x.data.completed
      }))
   }

   /**
    * Create a budget payment
    * @param budgetId 
    * @param paymentId 
    * @param updatedBudgetPayment 
    */
   public async create(budgetId: string, paymentId: string): Promise<BudgetPayment> {
      const budgetPayment: BudgetPayment = {
         budgetPaymentId: uuidv4(),
         budgetId,
         paymentId,
         completed: false
      }
      const request = {
         data: {
            userId: this.userId,
            ...budgetPayment
         }
      }
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         request
      ));
      return budgetPayment;
   }

   /**
    * Update a budget payment
    * @param budgetId 
    * @param paymentId 
    * @param updatedBudgetPayment 
    */
   public async update(budgetId: string, paymentId: string, updatedBudgetPayment: any): Promise<void> {
      let response = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId, paymentId])
      )) as Result<BudgetPayment>;
      response = await this.faunaDbClient.query(Query.Update(
         Query.Ref(response.ref.collection, response.ref.id),
         { data: { ...updatedBudgetPayment } }
      ));
   }

   /**
    * Delete a budget payment
    * @param budgetId 
    * @param paymentId 
    */
   public async delete(budgetId: string, paymentId: string): Promise<void> {
      const result: any = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId, paymentId])
      ));
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }
}