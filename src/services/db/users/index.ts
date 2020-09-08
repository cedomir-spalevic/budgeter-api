import { v4 as uuidv4 } from "uuid";
import { query as Query, Client } from "faunadb";
import { User } from "models/data";

export default class UsersService {
   private index: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor() {
      this.index = "userEmail";
      this.resource = "users";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Create a new User
    * @param email 
    */
   public async create(email: string): Promise<User> {
      const userId = uuidv4();
      const user: User = {
         userId,
         email
      }
      const request = {
         data: {
            userId: userId,
            ...user
         }
      }
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         request
      ));
      return user;
   }

   /**
    * Find a user by their email address
    * @param email 
    */
   public async findUserByEmail(email: string): Promise<User> {
      const result = await this.faunaDbClient.query(Query.Get(
         Query.Match(
            Query.Index(this.index), email
         )
      )) as any;
      return result.data as User;
   }
}