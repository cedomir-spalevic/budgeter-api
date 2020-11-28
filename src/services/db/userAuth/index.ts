import { query as Query, Client } from "faunadb";
import { Result } from "models/db";
import { generateHash } from "services/security";

export default class UsersAuthService {
   private userIndex: string;
   private index: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor() {
      this.userIndex = "singleUserAuth";
      this.index = "userAuth";
      this.resource = "auth";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Delete User Auth record
    * @param userId 
    */
   public async deleteUserAuth(userId: string): Promise<void> {
      const result = await this.faunaDbClient.query<Result<any>>(
         Query.Get(
            Query.Match(Query.Index(this.userIndex), [userId])
         )
      );
      await this.faunaDbClient.query(Query.Delete(Query.Ref(result.ref.collection, result.ref.id)))
   }

   /**
    * Create new record of user and password
    * @param userId 
    * @param password 
    */
   public async create(userId: string, password: string): Promise<boolean> {
      const hash = generateHash(password);
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         { data: { userId, hash } }
      ))
      return true;
   }


   /**
    * Find a record of a user and password
    * @param userId 
    * @param password 
    */
   public async find(userId: string, password: string): Promise<boolean> {
      const hash = generateHash(password);
      const response = await this.faunaDbClient.query<boolean>(
         Query.Exists(
            Query.Match(Query.Index(this.index), [userId, hash])
         )
      );
      return response;
   }
}