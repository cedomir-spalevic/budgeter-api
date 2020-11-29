import { query as Query, Client } from "faunadb";
import { Device } from "models/auth";
import { Result } from "models/db";

export default class DevicesService {
   private userId: string;
   private index: string;
   private resource: string;
   private faunaDbClient: Client;
   constructor(userId: string) {
      this.userId = userId;
      this.index = "userDevice";
      this.resource = "userDevices";
      this.faunaDbClient = new Client({ secret: process.env.FAUNADB_KEY });
   }

   /**
    * Determines if a user contains a device
    */
   public async containsDevice(): Promise<boolean> {
      return await this.faunaDbClient.query<boolean>(
         Query.Exists(
            Query.Match(Query.Index(this.index), [this.userId])
         )
      );
   }

   /**
    * Create a new device for a user
    * @param device
    */
   public async create(device: Device): Promise<void> {
      device.userId = this.userId;
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
    */
   public async deleteDevice(): Promise<void> {
      const result = await this.faunaDbClient.query<Result<Device>>(Query.Get(
         Query.Match(Query.Index(this.index), [this.userId])
      ));
      await this.faunaDbClient.query(Query.Delete(
         Query.Ref(result.ref.collection, result.ref.id)
      ));
   }
}