import { OneTimeCode } from "models/data";
import { Collection, FilterQuery, ObjectId, WithId } from "mongodb";
import Client from "../client";

/**
 * Service that communicates with the OTC (One Time Code) collection
 */
class OneTimeCodeService {
   protected collection: Collection<OneTimeCode>;
   static instance: OneTimeCodeService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(): Promise<OneTimeCodeService> {
      if (!OneTimeCodeService.instance) {
         OneTimeCodeService.instance = new OneTimeCodeService();
         const client = await Client.getInstance();
         OneTimeCodeService.instance.collection = client.db("budgeter").collection<OneTimeCode>("otc");
      }
      return OneTimeCodeService.instance;
   }

   public async create(userId: ObjectId, key: string, code: number, type: "emailVerification" | "passwordReset"): Promise<void> {
      const otc: OneTimeCode = {
         userId,
         key,
         code,
         type,
         completed: false,
         createdOn: new Date()
      }
      await this.collection.insertOne(otc);
   }

   public async find(filter: FilterQuery<OneTimeCode>): Promise<WithId<OneTimeCode>> {
      return await this.collection.findOne(filter);
   }

   public async complete(otc: WithId<OneTimeCode>): Promise<void> {
      otc.completed = true;
      await this.collection.replaceOne({ _id: otc._id }, otc);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }
}

export default {
   getInstance: () => OneTimeCodeService.getInstance()
}