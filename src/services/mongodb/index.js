import EntityCollection from "./collection.js";
import { getClient } from "./connection.js";

const getCollection = async (req, dbName, collectionName) => {
   const client = await getClient();
   const db = client.db(dbName);
   const collection = db.collection(collectionName);
   return new EntityCollection(req, collection);
};

export const oneTimeCodesService = async (req) => await getCollection(req, "security", "oneTimeCodes");