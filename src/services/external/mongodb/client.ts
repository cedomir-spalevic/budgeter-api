import { ApiKey } from "models/schemas/apiKey";
import { Income } from "models/schemas/income";
import { OneTimeCode } from "models/schemas/oneTimeCode";
import { Payment } from "models/schemas/payment";
import { RefreshToken } from "models/schemas/refreshToken";
import { User } from "models/schemas/user";
import { UserAuth } from "models/schemas/userAuth";
import { Db, MongoClient } from "mongodb";
import { BudgeterEntityCollection } from "./entityCollection";

class BudgeterMongoClient {
   private _db: Db;
   private _client: MongoClient;
   static instance: BudgeterMongoClient;

   constructor() {
      this._client = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
         useUnifiedTopology: true
      });
   }

   private async connect(): Promise<void> {
      await this._client.connect();
      this._db = this._client.db(process.env.MONGO_DB_NAME);
   }

   static async getInstance(): Promise<BudgeterMongoClient> {
      if (!BudgeterMongoClient.instance) {
         BudgeterMongoClient.instance = new BudgeterMongoClient();
         await BudgeterMongoClient.instance.connect();
      }
      return BudgeterMongoClient.instance;
   }

   public close = async () => {
      await this._client.close();
   };

   public getApiKeyCollection = () =>
      new BudgeterEntityCollection<ApiKey>(
         this._db.collection<ApiKey>("apiKeys")
      );

   public getOneTimeCodeCollection = () =>
      new BudgeterEntityCollection<OneTimeCode>(
         this._db.collection<OneTimeCode>("oneTimeCodes")
      );

   public getRefreshTokenCollection = () =>
      new BudgeterEntityCollection<RefreshToken>(
         this._db.collection<RefreshToken>("refreshTokens")
      );

   public getUsersAuthCollection = () =>
      new BudgeterEntityCollection<UserAuth>(
         this._db.collection<UserAuth>("usersAuth")
      );

   public getUsersCollection = () =>
      new BudgeterEntityCollection<User>(this._db.collection<User>("users"));

   public getIncomesCollection = () =>
      new BudgeterEntityCollection<Income>(
         this._db.collection<Income>("incomes")
      );

   public getPaymentsCollection = () =>
      new BudgeterEntityCollection<Payment>(
         this._db.collection<Payment>("payments")
      );
}

export default {
   getInstance: (): Promise<BudgeterMongoClient> =>
      BudgeterMongoClient.getInstance()
};
