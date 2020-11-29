import { query as Query, Client } from "faunadb";
import { Device } from "models/auth";
import { Result } from "models/db";

export default class DevicesService {
   private index: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor() {
      this.index = "userDevice";
      this.resource = "devices";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }
   /**
    * Create a new device for a user
    * @param device
    */
   public async create(device: Device): Promise<void> {
      const request = {
         data: {
            ...device
         }
      }
      await this.faunaDbClient.query(Query.Create(
         Query.Collection(this.resource),
         request
      ));
   }

   /**
    * Delete a users device
    * @param userId 
    */
   public async deleteDevice(userId: string): Promise<void> {
      const result = await this.faunaDbClient.query<Result<Device>>(Query.Get(
         Query.Match(Query.Index(this.index), [userId])
      ));
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }
}