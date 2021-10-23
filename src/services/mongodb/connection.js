import { MongoClient } from "mongodb";
import { BudgeterError } from "../../lib/middleware/error.js";

let client = null;

export const getClient = async () => {
   if(!client) {
      try {
         client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
            useUnifiedTopology: true
         });
         await client.connect();
      }
      catch(error) {
         throw new BudgeterError(500, "Most likely cannot connect to MongoDB");
      }
   }
   return client;
};