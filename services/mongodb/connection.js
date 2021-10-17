import { MongoClient } from "mongodb";

let client = null;

export const getClient = async () => {
   if(!client) {
      client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
         useUnifiedTopology: true
      });
      await client.connection;
   }
   return client;
};