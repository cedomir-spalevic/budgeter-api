import { query as Query, Client } from "faunadb";
import { generateHash } from "services/security";

export default class UsersAuthService {
   private index: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor() {
      this.index = "userAuth";
      this.resource = "auth";
      this.faunaDbClient = new Client({ secret: "fnADqVJnc0ACEqPqaIoYJ9xPZ1jArM-NLqLNblI4" })
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
      const response = await this.faunaDbClient.query(
         Query.Exists(
            Query.Match(Query.Index(this.index), [userId, hash])
         )
      ) as unknown;
      return response as boolean;
   }
}