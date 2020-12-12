import { MongoClient } from "mongodb";

class Client {
   private _client: MongoClient;
   static instance: Client;

   constructor() {
      this._client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
   }

   async connect() {
      await this._client.connect();
   }

   static async getInstance(): Promise<MongoClient> {
      if (!Client.instance) {
         Client.instance = new Client();
         await Client.instance.connect();
      }
      return Client.instance._client;
   }
}

export default {
   getInstance: () => Client.getInstance()
}
