import { OneTimeCode } from "models/data/oneTimeCode";
import { RefreshToken } from "models/data/refreshToken";
import { User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { Db, MongoClient } from "mongodb";
import { BudgeterEntityCollection } from "./entityCollection";

class BudgeterMongoClient {
   private _db: Db;
   private _client: MongoClient;
   static instance: BudgeterMongoClient;

   constructor() {
      this._client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
   }

   private async connect(): Promise<void> {
      await this._client.connect();
      this._db = this._client.db("budgeter");
   }

   static async getInstance(): Promise<BudgeterMongoClient> {
      if (!BudgeterMongoClient.instance) {
         BudgeterMongoClient.instance = new BudgeterMongoClient();
         await BudgeterMongoClient.instance.connect();
      }
      return BudgeterMongoClient.instance;
   }

   public getOneTimeCodeCollection = () => new BudgeterEntityCollection<OneTimeCode>(this._db.collection<OneTimeCode>("oneTimeCodes"));

   public getRefreshTokenCollection = () => new BudgeterEntityCollection<RefreshToken>(this._db.collection<RefreshToken>("refreshTokens"));

   public getUsersAuthCollection = () => new BudgeterEntityCollection<UserAuth>(this._db.collection<UserAuth>("usersAuth"));

   public getUsersCollection = () => new BudgeterEntityCollection<User>(this._db.collection<User>("users"));
}

export default {
   getInstance: () => BudgeterMongoClient.getInstance()
}
