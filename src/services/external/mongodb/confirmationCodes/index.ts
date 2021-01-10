import { ConfirmationCode, User } from "models/data";
import { Collection, ObjectId, WithId } from "mongodb";
import Client from "../client";

/**
 * Service that communicates with the Confirmation Codes collection
 */
class ConfirmationCodesService {
   protected collection: Collection<ConfirmationCode>;
   static instance: ConfirmationCodesService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(): Promise<ConfirmationCodesService> {
      if (!ConfirmationCodesService.instance) {
         ConfirmationCodesService.instance = new ConfirmationCodesService();
         const client = await Client.getInstance();
         ConfirmationCodesService.instance.collection = client.db("budgeter").collection<ConfirmationCode>("confirmationCodes");
      }
      return ConfirmationCodesService.instance;
   }

   public async create(userId: ObjectId, key: string, code: number): Promise<WithId<ConfirmationCode>> {
      const confirmationCode: ConfirmationCode = {
         userId,
         key,
         code
      };
      const response = await this.collection.insertOne(confirmationCode);
      return response.ops[0];
   }

   public async find(key: string, code: number): Promise<WithId<ConfirmationCode>> {
      return await this.collection.findOne({ key, code });
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }
}

export default {
   getInstance: () => ConfirmationCodesService.getInstance()
}