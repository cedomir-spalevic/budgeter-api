const { MongoClient } = require("mongodb");
const { BudgeterError } = require("lib/middleware/error");
const { getConfig } = require("config");

let client = null;

module.exports.getClient = async () => {
   if (!client) {
      try {
         const mongoDbUser = getConfig("MONGODB_USER");
         const mongoDbPwd = getConfig("MONGODB_PASSWORD");
         const mongoDbUri = getConfig("MONGODB_URI")
            .replace("${user}", mongoDbUser)
            .replace("${password}", mongoDbPwd);
         client = new MongoClient(mongoDbUri, {
            useUnifiedTopology: true
         });
         await client.connect();
      } catch (error) {
         throw new BudgeterError(
            400,
            "Downstream error: Mongodb connection error",
            error
         );
      }
   }
   return client;
};
