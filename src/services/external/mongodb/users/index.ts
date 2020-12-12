import { UserClaims } from "models/auth";
import { User } from "models/data-new";
import { Collection, ObjectId, WithId } from "mongodb";
import { getUTCDateObj } from "services/internal/datetime";
import Client from "../client";

/**
 * Service that communicates with the Users collection
 */
class UsersService {
   _collection: Collection<User>;
   static instance: UsersService;

   constructor() {
      this._collection = undefined;
   }

   static async getInstance(): Promise<UsersService> {
      if (!UsersService.instance) {
         UsersService.instance = new UsersService();
         const client = await Client.getInstance();
         UsersService.instance._collection = client.db("budgeter").collection<User>("users");
      }
      return UsersService.instance;
   }

   public async create(email: string, claims?: UserClaims[]): Promise<WithId<User>> {
      const currentDate = getUTCDateObj();
      const user: User = {
         email,
         isAdmin: (claims && claims.includes(UserClaims.Admin)),
         isService: (claims && claims.includes(UserClaims.Service)),
         createdOn: currentDate,
         modifiedOn: currentDate
      };
      const response = await this._collection.insertOne(user);
      return response.ops[0];
   }

   public async update(user: WithId<User>): Promise<void> {
      const currentDate = getUTCDateObj();
      user.modifiedOn = currentDate;
      await this._collection.replaceOne({ _id: user._id }, user);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this._collection.deleteOne({ _id: id });
   }

   public async findUserByEmail(email: string): Promise<WithId<User> | null> {
      return await this._collection.findOne({ email });
   }

   public async getById(id: ObjectId): Promise<WithId<User> | null> {
      return await this._collection.findOne({ _id: id });
   }

   public async get(limit: number, skip: number): Promise<WithId<User>[]> {
      const response = await this._collection.find<WithId<User>>({}, { limit, skip });
      const items: WithId<User>[] = [];
      response.forEach(x => items.push(x));
      return items;
   }
}

export default {
   getInstance: () => UsersService.getInstance()
}