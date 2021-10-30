import EntityCollection from "./collection.js";
import { getClient } from "./connection.js";
import { MONGO_COLLECTIONS, MONGO_DATABASES } from "../../utils/constants.js";

const collectionMap = {
   [MONGO_COLLECTIONS.ONE_TIME_CODES]: MONGO_DATABASES.SECURITY,
   [MONGO_COLLECTIONS.REFRESH_TOKENS]: MONGO_DATABASES.SECURITY,
   [MONGO_COLLECTIONS.USERS]: MONGO_DATABASES.ACCOUNTS,
   [MONGO_COLLECTIONS.DEVICES]: MONGO_DATABASES.ACCOUNTS,
   [MONGO_COLLECTIONS.PREFERENCES]: MONGO_DATABASES.ACCOUNTS
};

const getCollection = async (req, collectionName) => {
   const client = await getClient();
   const db = client.db(collectionMap[collectionName]);
   const collection = db.collection(collectionName);
   return new EntityCollection(req, collection);
};

export const getOneTimeCodesCollection = async (req) => await getCollection(req, MONGO_COLLECTIONS.ONE_TIME_CODES);

export const getRefreshTokensCollection = async (req) => await getCollection(req, MONGO_COLLECTIONS.REFRESH_TOKENS);

export const getUsersCollection = async (req) => await getCollection(req, MONGO_COLLECTIONS.USERS);

export const getDevicesCollection = async (req) => await getCollection(req, MONGO_COLLECTIONS.DEVICES);

export const getPreferencesCollection = async (req) => await getCollection(req, MONGO_COLLECTIONS.PREFERENCES);