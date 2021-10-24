import EntityCollection from "./collection.js";
import { getClient } from "./connection.js";

const collectionMap = {
   "oneTimeCodes": "security",
   "refreshTokens": "security",
   "users": "accounts"
};

const getCollection = async (req, collectionName) => {
   const client = await getClient();
   const db = client.db(collectionMap[collectionName]);
   const collection = db.collection(collectionName);
   return new EntityCollection(req, collection);
};

export const getOneTimeCodesCollection = async (req) => await getCollection(req, "oneTimeCodes");

export const getRefreshTokensCollection = async (req) => await getCollection(req, "refreshTokens");

export const getUsersCollection = async (req) => await getCollection(req, "users");