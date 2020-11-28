import { query as Query, Client } from "faunadb";
import { Result, ResultSet } from "models/db";
import { BudgetPayment } from "models/data";
import { v4 as uuidv4 } from "uuid";

export default class BudgetPaymentsService {
   private userId: string;
   private allIndex: string;
   private singularIndex: string;
   private budgetPluralIndex: string;
   private paymentPluralIndex: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor(userId: string) {
      this.userId = userId;
      this.allIndex = "allUserBudgetPayments";
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
      const result = await this.faunaDbClient.query<ResultSet<BudgetPayment>>(
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
    * Delete all budget payments for this user
    */
   public async deleteAllBudgetPayments(): Promise<void> {
      const result = await this.faunaDbClient.query<ResultSet<BudgetPayment>>(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.allIndex), [this.userId])),
            Query.Lambda(x => Query.Get(x))
         )
      );
      await Promise.all(result.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )))
   }

   /**
    * Delete all payments in a budget
    * @param budgetId 
    */
   public async deleteAll(budgetId: string): Promise<void> {
      const response = await this.getAllRefs(budgetId);
      await Promise.all(response.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )))
   }

   /**
    * Get all payments for a budget
    * @param budgetId 
    */
   public async getAll(budgetId: string): Promise<BudgetPayment[]> {
      const result = await this.getAllRefs(budgetId);
      return result.data.map(x => x.data);
   }

   /**
    * Get refs to all payments in a budget
    * @param budgetId 
    */
   private async getAllRefs(budgetId: string): Promise<ResultSet<BudgetPayment>> {
      return await this.faunaDbClient.query<ResultSet<BudgetPayment>>(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.budgetPluralIndex), [this.userId, budgetId])),
            Query.Lambda(x => Query.Get(x))
         )
      );
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
         completed: false,
         createdOn: new Date().toISOString(),
         modifiedOn: new Date().toISOString()
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
      updatedBudgetPayment.modifiedOn = new Date().toISOString();
      let response = await this.getRef(budgetId, paymentId);
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
      const result = await this.getRef(budgetId, paymentId);
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }

   /**
    * Get a Budget Payments reference
    * @param budgetId
    * @param paymentId 
    */
   private async getRef(budgetId: string, paymentId: string): Promise<Result<BudgetPayment>> {
      return await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, budgetId, paymentId])
      ));
   }
}