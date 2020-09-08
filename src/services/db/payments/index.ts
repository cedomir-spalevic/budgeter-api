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
    * Get payments for a user
    */
   public async get(): Promise<Payment[]> {
      const response = await this.faunaDbClient.query(
         Query.Map(
            Query.Paginate(Query.Match(Query.Index(this.pluralIndex), [this.userId])),
            Query.Lambda(x => Query.Get(x))
         )
      ) as ResultSet<any>;
      return response.data.map(x => ({
         paymentId: x.data.paymentId,
         name: x.data.name,
         amount: x.data.amount,
         dueDate: x.data.dueDate
      }))
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
         dueDate
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
      const response = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, paymentId])
      )) as Result<Payment>;
      await this.faunaDbClient.query(Query.Update(
         Query.Ref(response.ref.collection, response.ref.id),
         { data: { ...updatedPayment } }
      ));
   }

   /**
    * Delete a payment
    * @param paymentId 
    */
   public async delete(paymentId: string): Promise<void> {
      const result: any = await this.faunaDbClient.query(Query.Get(
         Query.Match(Query.Index(this.singularIndex), [this.userId, paymentId])
      ));
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }
}