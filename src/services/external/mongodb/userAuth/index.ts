import { UserAuth } from "models/data-new";
import { Collection, ObjectId } from "mongodb";
import { generateHash } from "services/internal/security";
import Client from "../client";

/**
 * Service that communicates with the Auth collection
 */
class UserAuthService {
   protected collection: Collection<UserAuth>;
   static instance: UserAuthService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(): Promise<UserAuthService> {
      if (!UserAuthService.instance) {
         UserAuthService.instance = new UserAuthService();
         const client = await Client.getInstance();
         UserAuthService.instance.collection = client.db("budgeter").collection<UserAuth>("auth");
      }
      return UserAuthService.instance;
   }

   public async create(userId: ObjectId, password: string): Promise<void> {
      const userAuth: UserAuth = {
         userId,
         hash: generateHash(password)
      };
      await this.collection.insertOne(userAuth);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }

   public async exists(userId: ObjectId, password: string): Promise<boolean> {
      const hash = generateHash(password);
      const count = await this.collection.countDocuments({ userId, hash });
      return count === 1;
   }
}

export default {
   getInstance: () => UserAuthService.getInstance()
}