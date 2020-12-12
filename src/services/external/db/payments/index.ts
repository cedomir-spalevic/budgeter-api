import { query as Query, Client } from "faunadb";
import { Result, ResultSet } from "models/db";
import { v4 as uuidv4 } from "uuid";
import { Payment } from "models/data";

export default class PaymentsService {
   private userId: string;
   private singularIndex: string;
   private pluralIndex: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor(userId: string) {
      this.userId = userId;
      this.singularIndex = "userPayment"
      this.pluralIndex = "userPayments";
      this.resource = "payments";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Get all payment refs for user
    */
   private async getAllRefs(): Promise<ResultSet<Payment>> {
      return await this.faunaDbClient.query<ResultSet<Payment>>(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.pluralIndex), [this.userId])),
            Query.Lambda(x => Query.Get(x))
         )
      );
   }

   /**
    * Get payments for a user
    */
   public async get(): Promise<Payment[]> {
      const response = await this.getAllRefs()
      return response.data.map(x => x.data);
   }

   /**
    * Create a new payment
    * @param name
    * @param amount
    * @param dueDate
    */
   public async create(name: string, amount: number, dueDate?: number): Promise<Payment> {
      const payment: Payment = {
         paymentId: uuidv4(),
         name,
         amount,
         dueDate,
         createdOn: new Date().toISOString(),
         modifiedOn: new Date().toISOString()
      }
      const request = {
         data: {
            userId: this.userId,
            ...payment
         }
      }
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         request
      ));
      return payment;
   }

   /**
    * Update a payment
    * @param paymentId 
    * @param updatedPayment
    */
   public async update(paymentId: string, updatedPayment: any): Promise<void> {
      updatedPayment.modifiedOn = new Date().toISOString();
      const result = await this.getRef(paymentId);
      await this.faunaDbClient.query(Query.Update(
         Query.Ref(result.ref.collection, result.ref.id),
         { data: { ...updatedPayment } }
      ));
   }

   /**
    * Delete all payments for this user
    */
   public async deleteAllPayments(): Promise<void> {
      const result = await this.getAllRefs();
      await Promise.all(result.data.map(async x => await this.faunaDbClient.query(
         Query.Delete(Query.Ref(x.ref.collection, x.ref.id))
      )));
   }

   /**
    * Delete a payment
    * @param paymentId 
    */
   public async delete(paymentId: string): Promise<void> {
      const result = await this.getRef(paymentId);
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }

   /**
    * Get a Payments reference
    * @param paymentId 
    */
   private async getRef(paymentId: string): Promise<Result<Payment>> {
      return await this.faunaDbClient.query<Result<Payment>>(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, paymentId])
      ));
   }
}