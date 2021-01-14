import { UserClaims } from "models/auth";
import { User } from "models/data";
import { Collection, ObjectId, WithId } from "mongodb";
import Client from "../client";

/**
 * Service that communicates with the Users collection
 */
class UsersService {
   protected collection: Collection<User>;
   static instance: UsersService;

   constructor() {
      this.collection = undefined;
   }

   static async getInstance(): Promise<UsersService> {
      if (!UsersService.instance) {
         UsersService.instance = new UsersService();
         const client = await Client.getInstance();
         UsersService.instance.collection = client.db("budgeter").collection<User>("users");
      }
      return UsersService.instance;
   }

   public async create(firstName: string, lastName: string, email: string, claims?: UserClaims[]): Promise<WithId<User>> {
      const currentDate = new Date();
      const user: User = {
         firstName,
         lastName,
         email,
         isAdmin: (claims && claims.includes(UserClaims.Admin)),
         isService: (claims && claims.includes(UserClaims.Service)),
         forceLogout: false,
         createdOn: currentDate,
         modifiedOn: currentDate,
         isEmailVerified: false
      };
      const response = await this.collection.insertOne(user);
      return response.ops[0];
   }

   public async update(user: WithId<User>): Promise<void> {
      user.modifiedOn = new Date();
      await this.collection.replaceOne({ _id: user._id }, user);
   }

   public async delete(id: ObjectId): Promise<void> {
      await this.collection.deleteOne({ _id: id });
   }

   public async findUserByEmail(email: string): Promise<WithId<User> | null> {
      return await this.collection.findOne({ email });
   }

   public async getById(id: ObjectId): Promise<WithId<User> | null> {
      return await this.collection.findOne({ _id: id });
   }

   public async get(limit: number, skip: number): Promise<WithId<User>[]> {
      const response = await this.collection.find<WithId<User>>({}, { limit, skip });
      const items: WithId<User>[] = []
      await response.forEach(x => items.push(x));
      return items;
   }

   public async count(): Promise<number> {
      return await this.collection.countDocuments();
   }
}

export default {
   getInstance: () => UsersService.getInstance()
}