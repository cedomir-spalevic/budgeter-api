import { Payment } from "models/data-new";
import { Collection, ObjectId, WithId } from "mongodb";
import { convertDateToUTCDate, getUTCDateObj } from "services/internal/datetime";
import Client from "../client";

/**
 * Service that communicates with the Payments collection
 */
class PaymentsService {
   protected userId: ObjectId;
   protected collection: Collection<Payment>;
   static instance: PaymentsService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(id: ObjectId): Promise<PaymentsService> {
      if (!PaymentsService.instance) {
         PaymentsService.instance = new PaymentsService();
         const client = await Client.getInstance();
         PaymentsService.instance.collection = client.db("budgeter").collection<Payment>("payments");
      }
      PaymentsService.instance.userId = id;
      return PaymentsService.instance;
   }

   public async create(name: string, amount: number, dueDate: Date): Promise<WithId<Payment>> {
      const currentDate = getUTCDateObj();
      const payment: Payment = {
         userId: this.userId,
         name,
         amount,
         dueDate: convertDateToUTCDate(dueDate),
         createdOn: currentDate,
         modifiedOn: currentDate
      };
      const response = await this.collection.insertOne(payment);
      return response.ops[0];
   }

   public async update(updatedPayment: WithId<Payment>): Promise<void> {
      const currentPayment = await this.getById(updatedPayment._id);
      if (currentPayment === null)
         return;
      let wasModified = false;
      if (updatedPayment.name !== currentPayment.name) {
         currentPayment.name = updatedPayment.name;
         wasModified = true;
      }
      if (currentPayment.dueDate !== updatedPayment.dueDate) {
         currentPayment.dueDate = convertDateToUTCDate(updatedPayment.dueDate);
         wasModified = true;
      }
      if (currentPayment.amount !== updatedPayment.amount) {
         currentPayment.amount = updatedPayment.amount;
         wasModified = true;
      }
      if (wasModified) {
         currentPayment.modifiedOn = getUTCDateObj();
         await this.collection.replaceOne({ _id: currentPayment._id }, currentPayment);
      }
   }

   public async deleteAll(): Promise<void> {
      await this.collection.deleteMany({ userId: this.userId });
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }

   public async getById(id: ObjectId): Promise<WithId<Payment> | null> {
      return await this.collection.findOne({ _id: id });
   }

   public async get(limit: number, skip: number): Promise<WithId<Payment>[]> {
      const response = await this.collection.find<WithId<Payment>>({}, { limit, skip });
      const items: WithId<Payment>[] = [];
      response.forEach(x => items.push(x));
      return items;
   }

   public async exists(paymentId: ObjectId): Promise<boolean> {
      const count = await this.collection.countDocuments({ _id: paymentId, userId: this.userId });
      return count === 1;
   }
}

export default {
   getInstance: (userId: ObjectId) => PaymentsService.getInstance(userId)
}