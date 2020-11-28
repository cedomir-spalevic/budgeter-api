import { v4 as uuidv4 } from "uuid";
import { query as Query, Client } from "faunadb";
import { User } from "models/data";
import { Result, ResultSet } from "models/db";

export enum UserClaims {
   Admin,
   Service
}

export default class UsersService {
   private userIndex: string;
   private emailIndex: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor() {
      this.userIndex = "users";
      this.emailIndex = "userEmail";
      this.resource = "users";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Get all users
    */
   public async getAllUsers(): Promise<User[]> {
      const result = await this.faunaDbClient.query<ResultSet<User>>(
         Query.Map(
            Query.Paginate(Query.Documents(Query.Collection(this.resource))),
            Query.Lambda(x => Query.Get(x))
         )
      )
      return result.data.map(x => x.data);
   }

   /**
    * Create a new User
    * @param email 
    * @param clams
    */
   public async create(email: string, claims?: UserClaims[]): Promise<User> {
      const userId = uuidv4();
      const isAdmin = (claims && claims.includes(UserClaims.Admin));
      const isService = (claims && claims.includes(UserClaims.Service));
      const user: User = {
         userId,
         email,
         isAdmin,
         isService,
         createdOn: new Date().toISOString(),
         modifiedOn: new Date().toISOString()
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
    * Update a User
    * @param id 
    * @param claims 
    */
   public async update(id: string, claims?: UserClaims[]): Promise<void> {
      const result = await this.getRef(id);
      const updatedUser = {
         ...result.data,
         isAdmin: (claims && claims.includes(UserClaims.Admin)),
         isService: (claims && claims.includes(UserClaims.Service)),
         modifiedOn: new Date().toISOString()
      }
      await this.faunaDbClient.query(Query.Update(
         Query.Ref(result.ref.collection, result.ref.id),
         { data: { ...updatedUser } }
      ));
   }

   /**
    * Get a user by its unique identifier
    * @param id 
    */
   public async getUserById(id: string): Promise<User> {
      const result = await this.getRef(id);
      return result.data;
   }

   /**
    * Find a user by their email address
    * @param email 
    */
   public async findUserByEmail(email: string): Promise<User> {
      const result = await this.faunaDbClient.query<Result<User>>(Query.Get(
         Query.Match(
            Query.Index(this.emailIndex), email
         )
      ));
      return result.data;
   }

   /**
    * Delete this user
    * @param userId 
    */
   public async delete(userId: string): Promise<void> {
      const userRef = await this.getRef(userId);
      await this.faunaDbClient.query(Query.Delete(Query.Ref(userRef.ref.collection, userRef.ref.id)))
   }

   /**
    * Get a User reference
    * @param userId 
    */
   private async getRef(userId: string): Promise<Result<User>> {
      return await this.faunaDbClient.query<Result<User>>(Query.Get(
         Query.Match(Query.Index(this.userIndex), [userId])
      ));
   }
}