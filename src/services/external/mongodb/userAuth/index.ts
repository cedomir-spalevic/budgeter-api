import { UserAuth } from "models/data-new";
import { Collection, ObjectId } from "mongodb";
import UsersAuthService from "services/external/db/userAuth";
import { generateHash } from "services/internal/security";
import Client from "../client";

/**
 * Service that communicates with the Auth collection
 */
class UserAuthService {
   _collection: Collection<UserAuth>;
   static instance: UserAuthService;

   constructor() {
      this._collection = undefined;
   }

   static async getInstance(): Promise<UserAuthService> {
      if (!UserAuthService.instance) {
         UserAuthService.instance = new UserAuthService();
         const client = await Client.getInstance();
         UserAuthService.instance._collection = client.db("budgeter").collection<UserAuth>("auth");
      }
      return UserAuthService.instance;
   }

   public async create(userId: ObjectId, password: string): Promise<void> {
      const userAuth: UserAuth = {
         userId,
         hash: generateHash(password)
      };
      await this._collection.insertOne(userAuth);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this._collection.deleteOne({ _id: id });
   }

   public async exists(userId: ObjectId, password: string): Promise<boolean> {
      const hash = generateHash(password);
      const count = await this._collection.countDocuments({ userId, hash });
      return count === 1;
   }
}

export default {
   getInstance: () => UserAuthService.getInstance()
}