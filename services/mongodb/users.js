import { getClient } from "./connection.js";

const getCollection = async () => {
   const client = await getClient();
   return client.db(process.env.MONGO_DB_NAME).collection("users");
};

export const find = async ({ email, phoneNumber }) => {
   const collection = await getCollection();

   return new Promise((resolve, reject) => {
      resolve({ email, phoneNumber, id: "123" });
   });
};