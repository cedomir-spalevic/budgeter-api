const { MongoClient } = require("mongodb");
const { BudgeterError } = require("lib/middleware/error");

let client = null;

module.exports.getClient = async () => {
   if(!client) {
      try {
         client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
            useUnifiedTopology: true
         });
         await client.connect();
      }
      catch(error) {
         throw new BudgeterError(400, "Downstream error: Mongodb connection error", error);
      }
   }
   return client;
};